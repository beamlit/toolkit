import { saveCredentials } from "./credentials.js";
import { Credentials } from "./types.js";

interface DeviceLoginFinalizeResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

/**
 * Handles client credentials authentication, managing access and refresh tokens.
 */
export class ClientCredentials {
  private credentials: Credentials;
  private workspace_name: string;
  private base_url: string;
  private refresh_promise: Promise<null> | null;
  private last_refresh_at: Date | null;
  /**
   * Constructs a new ClientCredentials instance.
   * @param credentials - The credentials containing client credentials and tokens.
   * @param workspace_name - The name of the workspace.
   * @param base_url - The base URL of the authentication server.
   */
  constructor(
    credentials: Credentials,
    workspace_name: string,
    base_url: string
  ) {
    this.credentials = credentials;
    this.workspace_name = workspace_name;
    this.base_url = base_url;
    this.refresh_promise = null
    this.last_refresh_at = null
  }

  /**
   * Retrieves the authentication headers, refreshing tokens if necessary.
   * @returns A promise resolving to a record of header key-value pairs.
   * @throws If token refresh fails.
   */
  async getHeaders(): Promise<Record<string, string>> {
    const err = await this.refreshIfNeeded();
    if (err) {
      throw err;
    }

    return {
      "X-Blaxel-Authorization": `Bearer ${this.credentials.access_token}`,
      "X-Blaxel-Workspace": this.workspace_name,
    };
  }

  async fetchWithTimeoutAndRetry(url: string, options: RequestInit, timeout: number, level=0): Promise<Response> {
    if(level > 10) {
      throw new Error("Failed to fetch with timeout and retry after 10 retries")
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return this.fetchWithTimeoutAndRetry(url, options, timeout, level+1)
      }
      throw e;
    }
  }
  
  /**
   * Refreshes the access token if it's expired or about to expire.
   * @returns A promise resolving to null, or an error if refresh fails.
   * @throws If token refresh fails.
   */
  async refreshIfNeeded(): Promise<null> {
    if (this.refresh_promise) {
      return this.refresh_promise;
    }
    this.refresh_promise = this.refreshInternal();
    const res = await this.refresh_promise;
    this.refresh_promise = null;
    return res;
  }

  async refreshInternal(): Promise<null> {
    const now = new Date()
    const time_since_refresh = (now.getTime() - (this.last_refresh_at?.getTime() || 0))/1000
    const expires_in = this.credentials.expires_in || 0
    if (
      this.credentials.client_credentials && time_since_refresh > expires_in/2
    ) {
      this.last_refresh_at = new Date();
      const body = { grant_type: "client_credentials" };

      try {
        const response = await this.fetchWithTimeoutAndRetry(`${this.base_url}/oauth/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${this.credentials.client_credentials}`,
          },
          body: JSON.stringify(body),
        },1000);
        const data = (await response.json()) as DeviceLoginFinalizeResponse;
        this.credentials.access_token = data.access_token;
        this.credentials.refresh_token = data.refresh_token;
        this.credentials.expires_in = data.expires_in;
      } catch (e) {
        throw new Error(`Failed to get client credentials: ${e}`);
      }
    }

    // Need to refresh token if expires in less than 10 minutes
    const parts = this.credentials.access_token?.split(".") || [];
    if (parts.length !== 3) {
      throw new Error("Invalid JWT token format");
    }

    try {
      const claimsBytes = Buffer.from(parts[1], "base64url");
      const claims = JSON.parse(claimsBytes.toString());
      const expTime = new Date(claims.exp * 1000);
      const currentTime = new Date();

      // Refresh if token expires in less than 10 minutes
      if (currentTime.getTime() + 10 * 60 * 1000 > expTime.getTime()) {
        return await this.doRefresh();
      }
    } catch (e) {
      throw new Error(`Failed to decode/parse JWT claims: ${e}`);
    }

    return null;
  }

  /**
   * Intercepts a request, setting the appropriate authentication headers.
   * @param req - The request to intercept and modify.
   * @throws If token refresh fails.
   */
  intercept(req: Request): void {
    const err = this.refreshIfNeeded();
    if (err) {
      throw err;
    }

    req.headers.set(
      "X-Blaxel-Authorization",
      `Bearer ${this.credentials.access_token}`
    );
    req.headers.set("X-Blaxel-Workspace", this.workspace_name);
  }

  /**
   * Performs the token refresh by requesting new access and refresh tokens.
   * @returns A promise resolving to null.
   * @throws If the refresh process fails.
   */
  private async doRefresh(): Promise<null> {
    if (!this.credentials.refresh_token) {
      throw new Error("No refresh token to refresh");
    }

    const url = `${this.base_url}/oauth/token`;
    const refresh_data = {
      grant_type: "refresh_token",
      refresh_token: this.credentials.refresh_token,
      device_code: this.credentials.device_code,
      client_id: "blaxel",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(refresh_data),
      });

      const finalize_response =
        (await response.json()) as DeviceLoginFinalizeResponse;

      if (!finalize_response.refresh_token) {
        finalize_response.refresh_token = this.credentials.refresh_token;
      }

      const creds: Credentials = {
        access_token: finalize_response.access_token,
        refresh_token: finalize_response.refresh_token,
        expires_in: finalize_response.expires_in,
        device_code: this.credentials.device_code,
        client_credentials: this.credentials.client_credentials,
      };

      this.credentials = creds;
      saveCredentials(this.workspace_name, creds);
      return null;
    } catch (e) {
      throw new Error(`Failed to refresh token: ${e}`);
    }
  }
}
