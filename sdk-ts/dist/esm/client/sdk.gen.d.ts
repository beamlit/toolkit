import { type OptionsLegacyParser } from '@hey-api/client-fetch';
import type { ListAgentsResponse, CreateAgentData, DeleteAgentData, GetAgentData, UpdateAgentData, GetAgentLogsData, GetAgentLogsResponse, GetAgentMetricsData, ListAgentRevisionsData, ListAgentRevisionsResponse, GetAgentTraceIdsData, ListFunctionsResponse, CreateFunctionData, DeleteFunctionData, GetFunctionData, UpdateFunctionData, GetFunctionLogsData, GetFunctionLogsResponse, GetFunctionMetricsData, ListFunctionRevisionsData, GetFunctionTraceIdsData, GetIntegrationData, ListIntegrationConnectionsResponse, CreateIntegrationConnectionData, DeleteIntegrationConnectionData, GetIntegrationConnectionData, UpdateIntegrationConnectionData, GetIntegrationConnectionModelEndpointConfigurationsData, ListIntegrationConnectionModelsData, GetIntegrationConnectionModelData, ListKnowledgebasesResponse, CreateKnowledgebaseData, DeleteKnowledgebaseData, GetKnowledgebaseData, UpdateKnowledgebaseData, ListKnowledgebaseRevisionsData, ListLocationsResponse, ListMcpHubDefinitionsResponse, ListModelsResponse, CreateModelData, DeleteModelData, GetModelData, UpdateModelData, GetModelLogsData, GetModelLogsResponse, GetModelMetricsData, ListModelRevisionsData, GetModelTraceIdsData, ListPoliciesResponse, CreatePolicyData, DeletePolicyData, GetPolicyData, UpdatePolicyData, ListPrivateClustersResponse, DeletePrivateClusterData, GetPrivateClusterData, UpdatePrivateClusterData, GetPrivateClusterHealthData, UpdatePrivateClusterHealthData, ListAllPendingInvitationsResponse, GetWorkspaceServiceAccountsResponse, CreateWorkspaceServiceAccountData, CreateWorkspaceServiceAccountResponse, DeleteWorkspaceServiceAccountData, DeleteWorkspaceServiceAccountResponse, UpdateWorkspaceServiceAccountData, UpdateWorkspaceServiceAccountResponse, ListApiKeysForServiceAccountData, ListApiKeysForServiceAccountResponse, CreateApiKeyForServiceAccountData, DeleteApiKeyForServiceAccountData, ListStoreAgentsResponse, GetStoreAgentData, ListStoreFunctionsResponse, GetStoreFunctionData, GetTraceIdsData, GetTraceIdsResponse, GetTraceData, GetTraceResponse, GetTraceLogsData, GetTraceLogsResponse, ListWorkspaceUsersResponse, InviteWorkspaceUserData, RemoveWorkspaceUserData, UpdateWorkspaceUserRoleData, ListWorkspacesResponse, CreateWorspaceData, DeleteWorkspaceData, GetWorkspaceData, UpdateWorkspaceData, DeclineWorkspaceInvitationData, AcceptWorkspaceInvitationData, LeaveWorkspaceData } from './types.gen.js';
export declare const client: import("@hey-api/client-fetch").Client<Request, Response, unknown, import("@hey-api/client-fetch").RequestOptions<boolean, string>>;
/**
 * List all agents
 */
export declare const listAgents: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListAgentsResponse, unknown, ThrowOnError>;
/**
 * Create agent by name
 */
export declare const createAgent: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<CreateAgentData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Agent, unknown, ThrowOnError>;
/**
 * Delete agent by name
 */
export declare const deleteAgent: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<DeleteAgentData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Agent, unknown, ThrowOnError>;
/**
 * Get agent by name
 */
export declare const getAgent: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetAgentData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Agent, unknown, ThrowOnError>;
/**
 * Update agent by name
 */
export declare const updateAgent: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<UpdateAgentData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Agent, unknown, ThrowOnError>;
export declare const getAgentLogs: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetAgentLogsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<GetAgentLogsResponse, unknown, ThrowOnError>;
/**
 * Get agent metrics
 */
export declare const getAgentMetrics: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetAgentMetricsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").ResourceMetrics, unknown, ThrowOnError>;
/**
 * List all agent revisions
 */
export declare const listAgentRevisions: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<ListAgentRevisionsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListAgentRevisionsResponse, unknown, ThrowOnError>;
/**
 * Get agent trace IDs
 */
export declare const getAgentTraceIds: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetAgentTraceIdsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").TraceIdsResponse, unknown, ThrowOnError>;
/**
 * List all configurations
 */
export declare const getConfiguration: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Configuration, unknown, ThrowOnError>;
/**
 * List all functions
 */
export declare const listFunctions: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListFunctionsResponse, unknown, ThrowOnError>;
/**
 * Create function
 */
export declare const createFunction: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<CreateFunctionData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Function, unknown, ThrowOnError>;
/**
 * Delete function by name
 */
export declare const deleteFunction: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<DeleteFunctionData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Function, unknown, ThrowOnError>;
/**
 * Get function by name
 */
export declare const getFunction: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetFunctionData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Function, unknown, ThrowOnError>;
/**
 * Update function by name
 */
export declare const updateFunction: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<UpdateFunctionData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Function, unknown, ThrowOnError>;
export declare const getFunctionLogs: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetFunctionLogsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<GetFunctionLogsResponse, unknown, ThrowOnError>;
/**
 * Get function metrics
 */
export declare const getFunctionMetrics: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetFunctionMetricsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").ResourceMetrics, unknown, ThrowOnError>;
/**
 * List function revisions
 * Returns revisions for a function by name.
 */
export declare const listFunctionRevisions: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<ListFunctionRevisionsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").RevisionMetadata, unknown, ThrowOnError>;
/**
 * Get function trace IDs
 */
export declare const getFunctionTraceIds: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetFunctionTraceIdsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").TraceIdsResponse, unknown, ThrowOnError>;
/**
 * List integrations connections
 * Returns integration information by name.
 */
export declare const getIntegration: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetIntegrationData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<unknown, unknown, ThrowOnError>;
/**
 * List integrations connections
 * Returns a list of all connections integrations in the workspace.
 */
export declare const listIntegrationConnections: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListIntegrationConnectionsResponse, unknown, ThrowOnError>;
/**
 * Create integration
 * Create a connection for an integration.
 */
export declare const createIntegrationConnection: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<CreateIntegrationConnectionData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").IntegrationConnection, unknown, ThrowOnError>;
/**
 * Delete integration
 * Deletes an integration connection by integration name and connection name.
 */
export declare const deleteIntegrationConnection: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<DeleteIntegrationConnectionData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").IntegrationConnection, unknown, ThrowOnError>;
/**
 * Get integration
 * Returns an integration connection by integration name and connection name.
 */
export declare const getIntegrationConnection: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetIntegrationConnectionData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").IntegrationConnection, unknown, ThrowOnError>;
/**
 * Update integration connection
 * Update an integration connection by integration name and connection name.
 */
export declare const updateIntegrationConnection: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<UpdateIntegrationConnectionData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").IntegrationConnection, unknown, ThrowOnError>;
/**
 * Get integration connection model endpoint configurations
 * Returns a list of all endpoint configurations for a model.
 */
export declare const getIntegrationConnectionModelEndpointConfigurations: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetIntegrationConnectionModelEndpointConfigurationsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<unknown, unknown, ThrowOnError>;
/**
 * List integration connection models
 * Returns a list of all models for an integration connection.
 */
export declare const listIntegrationConnectionModels: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<ListIntegrationConnectionModelsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<unknown, unknown, ThrowOnError>;
/**
 * Get integration model endpoint configurations
 * Returns a model for an integration connection by ID.
 */
export declare const getIntegrationConnectionModel: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetIntegrationConnectionModelData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<unknown, unknown, ThrowOnError>;
/**
 * List knowledgebases
 * Returns a list of all knowledgebases in the workspace.
 */
export declare const listKnowledgebases: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListKnowledgebasesResponse, unknown, ThrowOnError>;
/**
 * Create knowledgebase
 * Creates an knowledgebase.
 */
export declare const createKnowledgebase: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<CreateKnowledgebaseData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Knowledgebase, unknown, ThrowOnError>;
/**
 * Delete knowledgebase
 * Deletes an knowledgebase by Name.
 */
export declare const deleteKnowledgebase: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<DeleteKnowledgebaseData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Knowledgebase, unknown, ThrowOnError>;
/**
 * Get knowledgebase
 * Returns an knowledgebase by Name.
 */
export declare const getKnowledgebase: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetKnowledgebaseData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Knowledgebase, unknown, ThrowOnError>;
/**
 * Update knowledgebase
 * Updates an knowledgebase.
 */
export declare const updateKnowledgebase: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<UpdateKnowledgebaseData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Knowledgebase, unknown, ThrowOnError>;
/**
 * List knowledgebase revisions
 * Returns revisions for a knowledgebase by name.
 */
export declare const listKnowledgebaseRevisions: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<ListKnowledgebaseRevisionsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").RevisionMetadata, unknown, ThrowOnError>;
/**
 * List locations
 * Returns a list of all locations available with status.
 */
export declare const listLocations: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListLocationsResponse, unknown, ThrowOnError>;
export declare const listMcpHubDefinitions: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListMcpHubDefinitionsResponse, unknown, ThrowOnError>;
/**
 * Get metrics for a workspace
 * Returns metrics for the workspace's deployments.
 */
export declare const getMetrics: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Metrics, unknown, ThrowOnError>;
/**
 * List models
 * Returns a list of all models in the workspace.
 */
export declare const listModels: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListModelsResponse, unknown, ThrowOnError>;
/**
 * Create model
 * Creates a model.
 */
export declare const createModel: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<CreateModelData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Model, unknown, ThrowOnError>;
/**
 * Delete model
 * Deletes a model by name.
 */
export declare const deleteModel: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<DeleteModelData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Model, unknown, ThrowOnError>;
/**
 * Get model
 * Returns a model by name.
 */
export declare const getModel: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetModelData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Model, unknown, ThrowOnError>;
/**
 * Create or update model
 * Update a model by name.
 */
export declare const updateModel: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<UpdateModelData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Model, unknown, ThrowOnError>;
/**
 * Returns logs for a model deployment by name.
 */
export declare const getModelLogs: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetModelLogsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<GetModelLogsResponse, unknown, ThrowOnError>;
/**
 * Get model metrics
 * Returns metrics for a model by name.
 */
export declare const getModelMetrics: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetModelMetricsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").ResourceMetrics, unknown, ThrowOnError>;
/**
 * List model revisions
 * Returns revisions for a model by name.
 */
export declare const listModelRevisions: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<ListModelRevisionsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").RevisionMetadata, unknown, ThrowOnError>;
/**
 * Get model trace IDs
 */
export declare const getModelTraceIds: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetModelTraceIdsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").TraceIdsResponse, unknown, ThrowOnError>;
/**
 * List policies
 * Returns a list of all policies in the workspace.
 */
export declare const listPolicies: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListPoliciesResponse, unknown, ThrowOnError>;
/**
 * Create policy
 * Creates a policy.
 */
export declare const createPolicy: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<CreatePolicyData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Policy, unknown, ThrowOnError>;
/**
 * Delete policy
 * Deletes a policy by name.
 */
export declare const deletePolicy: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<DeletePolicyData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Policy, unknown, ThrowOnError>;
/**
 * Get policy
 * Returns a policy by name.
 */
export declare const getPolicy: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetPolicyData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Policy, unknown, ThrowOnError>;
/**
 * Update policy
 * Updates a policy.
 */
export declare const updatePolicy: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<UpdatePolicyData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Policy, unknown, ThrowOnError>;
/**
 * List all private clusters
 */
export declare const listPrivateClusters: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListPrivateClustersResponse, unknown, ThrowOnError>;
/**
 * Create private cluster
 */
export declare const createPrivateCluster: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").PrivateCluster, unknown, ThrowOnError>;
/**
 * Delete private cluster
 */
export declare const deletePrivateCluster: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<DeletePrivateClusterData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").PrivateCluster, unknown, ThrowOnError>;
/**
 * Get private cluster by name
 */
export declare const getPrivateCluster: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetPrivateClusterData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").PrivateCluster, unknown, ThrowOnError>;
/**
 * Update private cluster
 */
export declare const updatePrivateCluster: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<UpdatePrivateClusterData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").PrivateCluster, unknown, ThrowOnError>;
/**
 * Get private cluster health
 */
export declare const getPrivateClusterHealth: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetPrivateClusterHealthData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<unknown, unknown, ThrowOnError>;
/**
 * Update private cluster health
 */
export declare const updatePrivateClusterHealth: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<UpdatePrivateClusterHealthData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<unknown, unknown, ThrowOnError>;
/**
 * List pending invitations
 * Returns a list of all pending invitations in the workspace.
 */
export declare const listAllPendingInvitations: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListAllPendingInvitationsResponse, unknown, ThrowOnError>;
/**
 * Get workspace service accounts
 * Returns a list of all service accounts in the workspace.
 */
export declare const getWorkspaceServiceAccounts: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<GetWorkspaceServiceAccountsResponse, unknown, ThrowOnError>;
/**
 * Create workspace service account
 * Creates a service account in the workspace.
 */
export declare const createWorkspaceServiceAccount: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<CreateWorkspaceServiceAccountData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<CreateWorkspaceServiceAccountResponse, unknown, ThrowOnError>;
/**
 * Delete workspace service account
 * Deletes a service account.
 */
export declare const deleteWorkspaceServiceAccount: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<DeleteWorkspaceServiceAccountData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<DeleteWorkspaceServiceAccountResponse, unknown, ThrowOnError>;
/**
 * Update workspace service account
 * Updates a service account.
 */
export declare const updateWorkspaceServiceAccount: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<UpdateWorkspaceServiceAccountData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<UpdateWorkspaceServiceAccountResponse, unknown, ThrowOnError>;
/**
 * List API keys for service account
 * Returns a list of all API keys for a service account.
 */
export declare const listApiKeysForServiceAccount: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<ListApiKeysForServiceAccountData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListApiKeysForServiceAccountResponse, unknown, ThrowOnError>;
/**
 * Create API key for service account
 * Creates an API key for a service account.
 */
export declare const createApiKeyForServiceAccount: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<CreateApiKeyForServiceAccountData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").ApiKey, unknown, ThrowOnError>;
/**
 * Delete API key for service account
 * Deletes an API key for a service account.
 */
export declare const deleteApiKeyForServiceAccount: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<DeleteApiKeyForServiceAccountData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<unknown, unknown, ThrowOnError>;
/**
 * List all store agent
 */
export declare const listStoreAgents: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListStoreAgentsResponse, unknown, ThrowOnError>;
/**
 * Get store agent by name
 */
export declare const getStoreAgent: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetStoreAgentData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").StoreAgent, unknown, ThrowOnError>;
/**
 * List all store agent functions
 */
export declare const listStoreFunctions: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListStoreFunctionsResponse, unknown, ThrowOnError>;
/**
 * Get store agent function by name
 */
export declare const getStoreFunction: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetStoreFunctionData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").StoreFunction, unknown, ThrowOnError>;
/**
 * Get trace IDs
 */
export declare const getTraceIds: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<GetTraceIdsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<GetTraceIdsResponse, unknown, ThrowOnError>;
/**
 * Get trace by ID
 */
export declare const getTrace: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetTraceData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<GetTraceResponse, unknown, ThrowOnError>;
/**
 * Get trace logs
 */
export declare const getTraceLogs: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetTraceLogsData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<GetTraceLogsResponse, unknown, ThrowOnError>;
/**
 * List users in workspace
 * Returns a list of all users in the workspace.
 */
export declare const listWorkspaceUsers: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListWorkspaceUsersResponse, unknown, ThrowOnError>;
/**
 * Invite user to workspace
 * Invites a user to the workspace by email.
 */
export declare const inviteWorkspaceUser: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<InviteWorkspaceUserData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").PendingInvitation, unknown, ThrowOnError>;
/**
 * Remove user from workspace or revoke invitation
 * Removes a user from the workspace (or revokes an invitation if the user has not accepted the invitation yet).
 */
export declare const removeWorkspaceUser: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<RemoveWorkspaceUserData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<unknown, unknown, ThrowOnError>;
/**
 * Update user role in workspace
 * Updates the role of a user in the workspace.
 */
export declare const updateWorkspaceUserRole: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<UpdateWorkspaceUserRoleData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").WorkspaceUser, unknown, ThrowOnError>;
/**
 * List workspaces
 * Returns a list of all workspaces.
 */
export declare const listWorkspaces: <ThrowOnError extends boolean = false>(options?: OptionsLegacyParser<unknown, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<ListWorkspacesResponse, unknown, ThrowOnError>;
/**
 * Create worspace
 * Creates a workspace.
 */
export declare const createWorspace: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<CreateWorspaceData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Workspace, unknown, ThrowOnError>;
/**
 * Delete workspace
 * Deletes a workspace by name.
 */
export declare const deleteWorkspace: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<DeleteWorkspaceData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Workspace, unknown, ThrowOnError>;
/**
 * Get workspace
 * Returns a workspace by name.
 */
export declare const getWorkspace: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<GetWorkspaceData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Workspace, unknown, ThrowOnError>;
/**
 * Update workspace
 * Updates a workspace by name.
 */
export declare const updateWorkspace: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<UpdateWorkspaceData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Workspace, unknown, ThrowOnError>;
/**
 * Decline invitation to workspace
 * Declines an invitation to a workspace.
 */
export declare const declineWorkspaceInvitation: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<DeclineWorkspaceInvitationData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").PendingInvitation, unknown, ThrowOnError>;
/**
 * Accept invitation to workspace
 * Accepts an invitation to a workspace.
 */
export declare const acceptWorkspaceInvitation: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<AcceptWorkspaceInvitationData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").PendingInvitationAccept, unknown, ThrowOnError>;
/**
 * Leave workspace
 * Leaves a workspace.
 */
export declare const leaveWorkspace: <ThrowOnError extends boolean = false>(options: OptionsLegacyParser<LeaveWorkspaceData, ThrowOnError>) => import("@hey-api/client-fetch").RequestResult<import("./types.gen.js").Workspace, unknown, ThrowOnError>;
