import ast
import importlib
import json
import os
import sys
from dataclasses import dataclass
from logging import getLogger
from typing import Callable, Literal

from beamlit.common.settings import Settings, init
from beamlit.models import (AgentChain, AgentDeployment, Flavor,
                            FunctionDeployment, StoreFunctionParameter)

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), "src"))


@dataclass
class Resource:
    type: Literal["agent", "function"]
    module: Callable
    name: str
    decorator: ast.Call
    func: Callable

def get_resources(from_decorator, dir="src") -> list[Resource]:
    resources = []
    logger = getLogger(__name__)

    # Walk through all Python files in resources directory and subdirectories
    for root, _, files in os.walk(dir):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                # Read and compile the file content
                with open(file_path) as f:
                    try:
                        file_content = f.read()
                        # Parse the file content to find decorated resources
                        tree = ast.parse(file_content)

                        # Look for function definitions with decorators
                        for node in ast.walk(tree):
                            if (
                                not isinstance(node, ast.FunctionDef) and not isinstance(node, ast.AsyncFunctionDef)
                            ) or len(node.decorator_list) == 0:
                                continue
                            decorator = node.decorator_list[0]

                            decorator_name = ""
                            if isinstance(decorator, ast.Call):
                                decorator_name = decorator.func.id
                            if isinstance(decorator, ast.Name):
                                decorator_name = decorator.id
                            if decorator_name == from_decorator:
                                # Get the function name and decorator name
                                func_name = node.name

                                # Import the module to get the actual function
                                spec = importlib.util.spec_from_file_location(func_name, file_path)
                                module = importlib.util.module_from_spec(spec)
                                spec.loader.exec_module(module)
                                # Check if kit=True in the decorator arguments

                                # Get the decorated function
                                if hasattr(module, func_name) and isinstance(decorator, ast.Call):

                                    resources.append(
                                        Resource(
                                            type=decorator_name,
                                            module=module,
                                            name=func_name,
                                            func=getattr(module, func_name),
                                            decorator=decorator,
                                        )
                                    )
                    except Exception as e:
                        logger.warning(f"Error processing {file_path}: {e!s}")
    return resources


def get_parameters(resource: Resource) -> list[StoreFunctionParameter]:
    parameters = []
    # Get function signature
    import inspect
    sig = inspect.signature(resource.func)
    # Get docstring for parameter descriptions
    docstring = inspect.getdoc(resource.func)
    param_descriptions = {}
    if docstring:
        # Parse docstring for parameter descriptions
        lines = docstring.split('\n')
        for line in lines:
            line = line.strip().lower()
            if line.startswith(':param '):
                # Extract parameter name and description
                param_line = line[7:].split(':', 1)
                if len(param_line) == 2:
                    param_name = param_line[0].strip()
                    param_desc = param_line[1].strip()
                    param_descriptions[param_name] = param_desc
    for name, param in sig.parameters.items():
        # Skip *args and **kwargs parameters
        if param.kind in (inspect.Parameter.VAR_POSITIONAL, inspect.Parameter.VAR_KEYWORD):

            continue

        param_type = "string"  # Default type
        type_mapping = {
            'str': 'string',
            'int': 'integer',
            'float': 'number',
            'bool': 'boolean',
            'list': 'array',
            'dict': 'object',
            'none': 'null'
        }
        if param.annotation != inspect.Parameter.empty:
            # Map Python types to OpenAPI types
            if hasattr(param.annotation, "__name__"):
                param_type = param.annotation.__name__.lower()
            else:
                # Handle special types like Union, Optional etc
                param_type = str(param.annotation).lower()
        parameter = StoreFunctionParameter(
            name=name,
            type_=type_mapping.get(param_type, "string"),
            required=param.default == inspect.Parameter.empty,
            description=param_descriptions.get(name, f"Parameter {name}")
        )
        parameters.append(parameter)

    return parameters


def get_description(description: str | None, resource: Resource) -> str:
    if description:
        return description
    doc = resource.func.__doc__
    if doc:
        # Split docstring into sections and get only the description part
        doc_lines = doc.split('\n')
        description_lines = []
        for line in doc_lines:
            line = line.strip()
            # Stop when we hit param/return sections
            if line.startswith(':param') or line.startswith(':return'):
                break
            if line:
                description_lines.append(line)
        return ' '.join(description_lines).strip()
    return ""

def get_kwargs(arg: ast.Call) -> dict:
    kwargs = {}
    for keyword in arg.keywords:
        if isinstance(keyword.value, ast.Constant):
            kwargs[keyword.arg] = keyword.value.value
        elif isinstance(keyword.value, (ast.List, ast.Tuple)):
            kwargs[keyword.arg] = [
                AgentChain(**get_kwargs(elem)) if isinstance(elem, ast.Call) and isinstance(elem.func, ast.Name) and elem.func.id == "AgentChain"
                else elem.value if isinstance(elem, ast.Constant) else elem
                for elem in keyword.value.elts
            ]
        elif isinstance(keyword.value, ast.Dict):
            kwargs[keyword.arg] = {}
            for k, v in zip(keyword.value.keys, keyword.value.values):
                if isinstance(k, ast.Constant) and isinstance(v, ast.Constant):
                    kwargs[keyword.arg][k.value] = v.value
                if isinstance(k, ast.Constant) and isinstance(v, ast.Call):
                    kwargs[keyword.arg][k.value] = get_kwargs(v)
    return kwargs

def get_beamlit_deployment_from_resource(resource: Resource) -> AgentDeployment | FunctionDeployment:
    for arg in resource.decorator.args:
        if isinstance(arg, ast.Call):
            if isinstance(arg.func, ast.Name) and arg.func.id == "AgentDeployment":
                kwargs = get_kwargs(arg)
                description = kwargs.pop("description", None)
                return AgentDeployment(**kwargs, description=get_description(description, resource))
            if isinstance(arg.func, ast.Name) and arg.func.id == "FunctionDeployment":
                kwargs = get_kwargs(arg)
                description = kwargs.pop("description", None)
                return FunctionDeployment(**kwargs, parameters=get_parameters(resource), description=get_description(description, resource))
    if resource.type == "agent":
        return AgentDeployment(
            agent=resource.name,
            description=get_description(None,resource)
        )
    if resource.type == "function":
        return FunctionDeployment(
            function=resource.name,
            parameters=get_parameters(resource),
            description=get_description(None,resource)
        )
    return None


def get_flavors(flavors: list[Flavor]) -> str:
    if not flavors:
        return "[]"
    return json.dumps([flavor.to_dict() for flavor in flavors])

def format_parameters(parameters: list[StoreFunctionParameter]) -> str:
    if not parameters:
        return "[]"

    formatted = []
    for param in parameters:
        formatted.append(f"""
      - name: {param.name}
        type: {param.type_}
        required: {str(param.required).lower()}
        description: {param.description}""")

    return "\n".join(formatted)

def format_agent_chain(agent_chain: list[AgentChain]) -> str:
    if not agent_chain:
        return "[]"
    formatted = []

    for agent in agent_chain:
        formatted.append(f"""
      - agent: {agent.name}
        enabled: {agent.enabled}""")
        if agent.description:
            formatted.append(f"        description: {agent.description}")
    return "\n".join(formatted)

def get_agent_yaml(agent: AgentDeployment, functions: list[tuple[Resource, FunctionDeployment]], settings: Settings) -> str:
    template = f"""
apiVersion: beamlit.com/v1alpha1
kind: Agent
metadata:
  name: {agent.agent}
spec:
  display_name: Agent - {agent.agent}
  deployments:
  - environment: production
    enabled: true
    policies: [{", ".join(agent.policies or [])}]
    functions: [{", ".join([f"{function.function}" for (_, function) in functions])}]
    agent_chain: {format_agent_chain(agent.agent_chain)}
    model: {agent.model}
"""
    if agent.description:
        template += f"""    description: |
      {agent.description}"""
    return template

def get_function_yaml(function: FunctionDeployment, settings: Settings) -> str:
    return f"""
apiVersion: beamlit.com/v1alpha1
kind: Function
metadata:
  name: {function.function}
spec:
  display_name: {function.function}
  deployments:
  - environment: {settings.environment}
    enabled: true
    policies: [{", ".join(function.policies or [])}]
    description: |
      {function.description}
    parameters: {format_parameters(function.parameters)}
"""

def dockerfile(type: Literal["agent", "function"], resource: Resource, deployment: AgentDeployment | FunctionDeployment):
    if type == "agent":
        module = f"{resource.module.__file__.split('/')[-1].replace('.py', '')}.{resource.module.__name__}"
    else:
        module = f"functions.{resource.module.__name__}.{resource.func.__name__}"
    cmd = ["bl", "serve", "--port", "80", "--module", module]
    if type == "agent":
        cmd.append("--remote")
    cmd_str = ','.join([f'"{c}"' for c in cmd])

    return f"""
FROM python:3.12-slim

ARG UV_VERSION="latest"
RUN apt update && apt install -y curl

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
RUN curl -fsSL https://raw.githubusercontent.com/beamlit/toolkit/main/install.sh | BINDIR=/bin sh
WORKDIR /beamlit

# Install the application dependencies.
COPY pyproject.toml /beamlit/pyproject.toml
COPY uv.lock /beamlit/uv.lock
RUN uv sync --no-cache

COPY README.md /beamlit/README.md
COPY LICENSE /beamlit/LICENSE
COPY src /beamlit/src

ENV PATH="/beamlit/.venv/bin:$PATH"

ENTRYPOINT [{cmd_str}]
"""

def generate_beamlit_deployment(directory: str):
    settings = init()
    logger = getLogger(__name__)
    logger.info(f"Importing server module: {settings.server.module}")
    functions: list[tuple[Resource, FunctionDeployment]] = []
    agents: list[tuple[Resource, AgentDeployment]] = []
    for agent in get_resources("agent"):
        agent_deployment = get_beamlit_deployment_from_resource(agent)
        if agent_deployment:
            agents.append((agent, agent_deployment))
    for function in get_resources("function"):
        function_deployment = get_beamlit_deployment_from_resource(function)
        if function_deployment:
            functions.append((function, function_deployment))

    agents_dir = os.path.join(directory, "agents")
    functions_dir = os.path.join(directory, "functions")
    # Create directory if it doesn't exist
    os.makedirs(agents_dir, exist_ok=True)
    os.makedirs(functions_dir, exist_ok=True)
    for (resource, agent) in agents:
        # write deployment file
        agent_dir = os.path.join(agents_dir, agent.agent)
        os.makedirs(agent_dir, exist_ok=True)
        with open(os.path.join(agent_dir, f"agent.yaml"), "w") as f:
            content = get_agent_yaml(agent, functions, settings)
            f.write(content)
        # write dockerfile for build
        with open(os.path.join(agent_dir, f"Dockerfile"), "w") as f:
            content = dockerfile("agent", resource, agent)
            f.write(content)
    for (resource, function) in functions:
        # write deployment file
        function_dir = os.path.join(functions_dir, function.function)
        os.makedirs(function_dir, exist_ok=True)
        with open(os.path.join(function_dir, f"function.yaml"), "w") as f:
            content = get_function_yaml(function, settings)
            f.write(content)
        # write dockerfile for build
        with open(os.path.join(function_dir, f"Dockerfile"), "w") as f:
            content = dockerfile("function", resource, function)
            f.write(content)