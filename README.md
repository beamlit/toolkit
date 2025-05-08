# Blaxel Toolkit

## Install cli on MacOS
```sh
brew tap blaxel-ai/blaxel
brew install blaxel
```

## Sample usage of SDK

```go
package main

import (
	"context"
	"log/slog"
	"os"

	"github.com/davecgh/go-spew/spew"
	"github.com/blaxel-ai/toolkit/sdk"
)

var BASE_URL = "https://api.blaxel.ai/v0"
var RUN_URL = "https://run.blaxel.ai"

func init() {
	if url := os.Getenv("BL_API_URL"); url != "" {
		BASE_URL = url
	}
	if runUrl := os.Getenv("BL_RUN_URL"); runUrl != "" {
		RUN_URL = runUrl
	}
}
func main() {
	ctx := context.Background()

	client, err := sdk.NewClientWithCredentials(sdk.RunClientWithCredentials{
		ApiURL:      BASE_URL,
		RunURL:      RUN_URL,
		Credentials: sdk.Credentials{APIKey: "BL_96UX6OFWA6JG9IA1NDE7CCMED22U8Z2F"},
		Workspace:   "chris",
	})
	if err != nil {
		slog.Error("Error creating client", "error", err)
		os.Exit(1)
	}

	if err != nil {
		slog.Error("Error creating client", "error", err)
		os.Exit(1)
	}

	env, err := client.PutAgentWithResponse(ctx, "test", sdk.PutAgentJSONRequestBody{
		Name:        sdk.BlString("test"),
		DisplayName: sdk.BlString("Test"),
	})
	if err != nil {
		slog.Error("Error updating agent", "error", err)
		os.Exit(1)
	}
	spew.Dump(&env.JSON200)
}

```
