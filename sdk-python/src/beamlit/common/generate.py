from typing import Tuple

from beamlit.common.settings import Settings, get_settings
from beamlit.models import Agent, Function, FunctionMetadata, FunctionSpec
from beamlit.models.function_kit import FunctionKit


def get_titles_name(name: str) -> str:
    return name.title().replace("-", "").replace("_", "")


def generate_kit_function_code(
    settings: Settings, function: Function, kit: FunctionKit
) -> Tuple[str, str]:
    export_code = ""
    code = ""
    for kit in kit:
        fn = Function(
            metadata=FunctionMetadata(
                name=kit.name,
                workspace=settings.workspace,
                environment=settings.environment,
            ),
            spec=FunctionSpec(
                parameters=kit.parameters,
                description=kit.description,
            ),
        )
        new_code, export = generate_function_code(
            settings, fn, force_name_in_endpoint=function.metadata.name, kit=True
        )
        code += new_code
        export_code += export
    return code, export_code


def generate_function_code(
    settings: Settings,
    function: Function,
    force_name_in_endpoint: str = "",
    kit: bool = False,
) -> Tuple[str, str]:
    name = get_titles_name(function.metadata.name)
    if function.spec.parameters and len(function.spec.parameters) > 0:
        args_list = ", ".join(f"{param.name}: str" for param in function.spec.parameters)
        args_list += ", "
    else:
        args_list = ""
    args_schema = ""
    if function.spec.parameters:
        for param in function.spec.parameters:
            args_schema += f'{param.name}: str = Field(description="""{param.description}""")\n    '
    if len(args_schema) == 0:
        args_schema = "pass"

    # TODO: add return direct in function configuration
    return_direct = False
    endpoint_name = force_name_in_endpoint or function.metadata.name
    body = "{}"
    if function.spec.parameters:
        body = f'{", ".join(f'"{param.name}": {param.name}' for param in function.spec.parameters)}'
    if kit is True:
        has_name = False
        if function.spec.parameters:
            for param in function.spec.parameters:
                if param.name == "name":
                    has_name = True
                    break
        if not has_name:
            if len(body) > 0:
                body += ", "
            body += f'"name": "{function.metadata.name}"'
    return (
        f'''

class Beamlit{name}Input(BaseModel):
    {args_schema}

class Beamlit{name}(BaseTool):
    name: str = "beamlit_{function.metadata.name.replace("-", "_")}"
    description: str = """{function.spec.description}"""
    args_schema: Type[BaseModel] = Beamlit{name}Input

    response_format: Literal["content_and_artifact"] = "content_and_artifact"
    return_direct: bool = {return_direct}

    def _run(self, {args_list} run_manager: Optional[CallbackManagerForToolRun] = None) -> Tuple[Union[List[Dict[str, str]], str], Dict]:
        try:
            params = self.metadata.get("params", {{}})
            response = run_client.run("function", "{endpoint_name}", settings.environment, "POST", json={{{body}}})
            if response.status_code >= 400:
                logger.error(f"Failed to run function {name}, {{response.status_code}}::{{response.text}}")
                raise Exception(f"Failed to run function {name}, {{response.status_code}}::{{response.text}}")
            return response.json(), {{}}
        except Exception as e:
            return repr(e), {{}}
''',
        f"Beamlit{get_titles_name(function.metadata.name)},",
    )


def generate_chain_code(settings: Settings, agent: Agent) -> Tuple[str, str]:
    name = get_titles_name(agent.metadata.name)
    # TODO: add return direct in agent configuration
    return_direct = False
    return (
        f'''
class BeamlitChain{name}Input(BaseModel):
    input: str = Field(description='{agent.spec.description}')

class BeamlitChain{name}(BaseTool):
    name: str = "beamlit_chain_{agent.metadata.name.replace("-", "_")}"
    description: str = """{agent.spec.description}"""
    args_schema: Type[BaseModel] = BeamlitChain{name}Input

    response_format: Literal["content_and_artifact"] = "content_and_artifact"
    return_direct: bool = {return_direct}

    def _run(
        self,
        input: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> Tuple[Union[List[Dict[str, str]], str], Dict]:
        try:
            params = self.metadata.get("params", {{}})
            response = run_client.run("agent", "{agent.metadata.name}", settings.environment, "POST", json={{"input": input}})
            if response.status_code >= 400:
                logger.error(f"Failed to run tool {agent.metadata.name}, {{response.status_code}}::{{response.text}}")
                raise Exception(f"Failed to run tool {agent.metadata.name}, {{response.status_code}}::{{response.text}}")
            if response.headers.get("Content-Type") == "application/json":
                return response.json(), {{}}
            else:
                return response.text, {{}}
        except Exception as e:
            return repr(e), {{}}
''',
        f"BeamlitChain{name},",
    )


def generate(destination: str, dry_run: bool = False):
    imports = """from logging import getLogger
from typing import Dict, List, Literal, Optional, Tuple, Type, Union

from langchain_core.callbacks import CallbackManagerForToolRun
from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field
from beamlit.authentication import (RunClientWithCredentials,
                                    load_credentials_from_settings,
                                    new_client_with_credentials)
from beamlit.common.settings import get_settings
from beamlit.run import RunClient

logger = getLogger(__name__)
settings = get_settings()
credentials = load_credentials_from_settings(settings)

client_config = RunClientWithCredentials(
    credentials=credentials,
    workspace=settings.workspace,
)
client = new_client_with_credentials(client_config)
run_client = RunClient(client=client)
"""
    settings = get_settings()
    export_code = "\n\nfunctions = ["
    export_chain = "\n\nchains = ["
    code = imports
    if settings.agent.functions and len(settings.agent.functions) > 0:
        for function_config in settings.agent.functions:
            if function_config.spec.kit and len(function_config.spec.kit) > 0:
                new_code, export = generate_kit_function_code(
                    settings, function_config, function_config.spec.kit
                )
                code += new_code
                export_code += export
            else:
                new_code, export = generate_function_code(settings, function_config)
                code += new_code
                export_code += export
    if settings.agent.chain and len(settings.agent.chain) > 0:
        for agent in settings.agent.chain:
            new_code, export = generate_chain_code(settings, agent)
            code += new_code
            export_chain += export
    if settings.agent.functions and len(settings.agent.functions) > 0:
        export_code = export_code[:-1]
    export_code += "]"
    if settings.agent.chain and len(settings.agent.chain) > 0:
        export_chain = export_chain[:-1]
    export_chain += "]"
    content = code + export_code + export_chain
    if not dry_run:
        with open(destination, "w") as f:
            f.write(content)
    return content
