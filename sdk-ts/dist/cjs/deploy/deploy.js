"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBeamlitDeployment = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const common_1 = require("../agents/common");
const authentication_1 = require("../authentication");
const client_1 = require("../client");
const common_2 = require("../common");
const settings_1 = require("../common/settings");
const slugify_1 = require("../common/slugify");
const common_3 = require("../functions/common");
/**
 * Generates a Dockerfile for the specified resource.
 * @param settings - The current application settings.
 * @param resourceType - Type of resource ('agent' or 'function').
 * @param resource - The resource configuration.
 * @returns A string containing the Dockerfile content.
 */
const generateDockerfile = (settings, resourceType, resource) => {
    const cmd = ["bl", "serve", "--port", "80", "--module"];
    if (resourceType === "agent") {
        cmd.push(`${settings.server.directory}/${settings.server.module}`.replaceAll("/", "."));
        cmd.push("--remote");
    }
    if (resourceType === "function") {
        cmd.push(`${settings.agent.functionsDirectory}/${resource.metadata?.name}.doNotRemove`.replaceAll("/", "."));
    }
    const cmdStr = cmd.map((c) => `"${c}"`).join(",");
    return `
FROM node:20-slim

RUN apt update && apt install -y curl build-essential

RUN curl -fsSL https://raw.githubusercontent.com/beamlit/toolkit/main/install.sh | BINDIR=/bin sh
WORKDIR /beamlit

# Install dependencies
COPY package.json /beamlit/package.json
COPY package-lock.json /beamlit/package-lock.json
RUN npm i

# Copy source code and utils files
COPY README.m[d] /beamlit/README.md
COPY LICENS[E] /beamlit/LICENSE
COPY tsconfig.jso[n] /beamlit/tsconfig.json
COPY ${settings.server.directory} /beamlit/src
COPY index.t[s] /beamlit/index.ts

RUN npm run build
RUN cp -r dist/* /beamlit

ENV COMMAND="node index.js"

ENTRYPOINT [${cmdStr}]
`;
};
/**
 * Generates Dockerfiles and configurations for functions within the specified directory.
 * @param settings - The current application settings.
 * @param directory - The directory to output the generated Dockerfiles.
 * @returns An array of FunctionBase instances.
 */
const generateFunctions = async (settings, directory) => {
    const functions = await (0, common_3.retrieveWrapperFunction)(settings.agent.functionsDirectory, false);
    functions.forEach((func) => {
        const functionConfiguration = func.function;
        const dockerfile = generateDockerfile(settings, "function", functionConfiguration);
        if (functionConfiguration.metadata?.name) {
            const funcName = (0, slugify_1.slugify)(functionConfiguration.metadata.name);
            functionConfiguration.metadata.name = funcName;
            functionConfiguration.metadata.labels =
                functionConfiguration.metadata.labels || {};
            functionConfiguration.metadata.labels["x-beamlit-auto-generated"] =
                "true";
            if (!fs_1.default.existsSync(`${directory}/functions`)) {
                fs_1.default.mkdirSync(`${directory}/functions`);
            }
            if (!fs_1.default.existsSync(`${directory}/functions/${funcName}`)) {
                fs_1.default.mkdirSync(`${directory}/functions/${funcName}`);
            }
            fs_1.default.writeFileSync(`${directory}/functions/${funcName}/Dockerfile`, dockerfile);
            fs_1.default.writeFileSync(`${directory}/functions/${funcName}/function.yaml`, yaml_1.default.stringify({
                apiVersion: "beamlit.com/v1alpha1",
                kind: "Function",
                ...functionConfiguration,
            }));
        }
    });
    return functions;
};
const generateAgents = async (settings, directory, functionsNames, client) => {
    const agentDirectory = settings.server.directory;
    if (!fs_1.default.existsSync(agentDirectory))
        throw new Error(`Agent directory ${agentDirectory} not found`);
    const agents = await (0, common_1.retrieveWrapperAgent)(agentDirectory, false);
    await Promise.all(agents.map(async (agent) => {
        const agentConfiguration = agent.agent;
        if (agentConfiguration && agentConfiguration.metadata?.name) {
            const dockerfile = generateDockerfile(settings, "agent", agentConfiguration);
            try {
                const { data } = await (0, client_1.getAgent)({
                    client,
                    path: { agentName: agentConfiguration.metadata.name },
                });
                agentConfiguration.spec.repository = data?.spec?.repository;
            }
            catch (error) {
                common_2.logger.error(`Error retrieving agent ${agentConfiguration.metadata.name}: ${error}`);
            }
            const remoteFunctions = agent.remoteFunctions || [];
            const existingFunctions = agentConfiguration.spec?.functions || [];
            const agentName = (0, slugify_1.slugify)(agentConfiguration.metadata.name);
            agentConfiguration.metadata.name = agentName;
            agentConfiguration.spec.functions = [
                ...new Set([
                    ...functionsNames,
                    ...remoteFunctions,
                    ...existingFunctions,
                ]),
            ];
            agentConfiguration.metadata.labels =
                agentConfiguration.metadata.labels || {};
            agentConfiguration.metadata.labels["x-beamlit-auto-generated"] = "true";
            if (!fs_1.default.existsSync(`${directory}/agents`)) {
                fs_1.default.mkdirSync(`${directory}/agents`);
            }
            if (!fs_1.default.existsSync(`${directory}/agents/${agentName}`)) {
                fs_1.default.mkdirSync(`${directory}/agents/${agentName}`);
            }
            fs_1.default.writeFileSync(`${directory}/agents/${agentName}/Dockerfile`, dockerfile);
            fs_1.default.writeFileSync(`${directory}/agents/${agentName}/agent.yaml`, yaml_1.default.stringify({
                apiVersion: "beamlit.com/v1alpha1",
                kind: "Agent",
                ...agentConfiguration,
            }));
        }
    }));
    return agents;
};
/**
 * Cleans up auto-generated deployment files that are no longer needed.
 * @param directory - The directory where deployments are located.
 * @param type - The type of deployment ('agent' or 'function').
 * @param deployments - The list of current deployments.
 */
const cleanAutoGenerated = (directory, type, deployments) => {
    const deployDir = path_1.default.join(directory, `${type}s`);
    const deployNames = deployments.map((d) => {
        if ("agent" in d) {
            return d.agent?.metadata?.name;
        }
        else {
            return d.function?.metadata?.name;
        }
    });
    if (fs_1.default.existsSync(deployDir)) {
        fs_1.default.readdirSync(deployDir).forEach((itemDir) => {
            const fullPath = path_1.default.join(deployDir, itemDir);
            if (fs_1.default.statSync(fullPath).isDirectory() &&
                !deployNames.includes(itemDir)) {
                const yamlFile = path_1.default.join(fullPath, `${type}.yaml`);
                if (fs_1.default.existsSync(yamlFile)) {
                    try {
                        const content = yaml_1.default.parse(fs_1.default.readFileSync(yamlFile, "utf8"));
                        if (content?.metadata?.labels?.["x-beamlit-auto-generated"] === "true") {
                            fs_1.default.rmSync(fullPath, { recursive: true, force: true });
                        }
                    }
                    catch {
                        return;
                    }
                }
            }
        });
    }
};
/**
 * Generates the entire Beamlit deployment configuration, including agents and functions.
 * @param directory - The directory to output the generated deployment files.
 */
const generateBeamlitDeployment = async (directory) => {
    if (!fs_1.default.existsSync(directory)) {
        fs_1.default.mkdirSync(directory);
    }
    const settings = (0, settings_1.init)();
    const client = (0, authentication_1.newClient)();
    let functions = [];
    if (!fs_1.default.existsSync(settings.agent.functionsDirectory)) {
        common_2.logger.warn(`Functions directory ${settings.agent.functionsDirectory} not found`);
        functions = [];
    }
    else {
        functions = await generateFunctions(settings, directory);
    }
    const functionsNames = functions.map((f) => f.function.metadata?.name || "");
    const agents = await generateAgents(settings, directory, functionsNames, client);
    cleanAutoGenerated(directory, "function", functions);
    cleanAutoGenerated(directory, "agent", agents);
};
exports.generateBeamlitDeployment = generateBeamlitDeployment;
