import os
from logging import getLogger
from typing import Tuple, Type, Union

from beamlit.api.agents import get_agent
from beamlit.api.functions import get_function
from beamlit.api.models import get_model
from beamlit.client import AuthenticatedClient
from beamlit.common.logger import init as init_logger
from beamlit.models import Agent, Function, Model
from beamlit.types import UNSET, Unset
from langchain_core.language_models.chat_models import BaseChatModel
from langgraph.graph.graph import CompiledGraph
from pydantic import Field
from pydantic_settings import (BaseSettings, PydanticBaseSettingsSource,
                               SettingsConfigDict, YamlConfigSettingsSource)

global SETTINGS
SETTINGS = None


def get_settings():
    return SETTINGS


class SettingsAgent(BaseSettings):
    agent: Union[None, CompiledGraph, BaseChatModel] = None
    chain: Union[Unset, list[Agent]] = UNSET
    model: Union[Unset, Model] = UNSET
    functions: Union[Unset, list[Function]] = UNSET
    functions_directory: str = Field(default="src/functions")
    chat_model: Union[None, BaseChatModel] = None
    module: str = Field(default="main.main")


class SettingsAuthenticationClient(BaseSettings):
    credentials: Union[None, str] = None


class SettingsAuthentication(BaseSettings):
    api_key: Union[None, str] = None
    jwt: Union[None, str] = None
    client: SettingsAuthenticationClient = SettingsAuthenticationClient()


class SettingsServer(BaseSettings):
    module: str = Field(default="main.main")
    port: int = Field(default=80)
    host: str = Field(default="0.0.0.0")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        yaml_file="beamlit.yaml",
        env_prefix="bl_",
        env_nested_delimiter="_",
        extra="ignore",
    )

    workspace: str
    environment: str = Field(default="production")
    remote: bool = Field(default=False)
    type: str = Field(default="agent")
    name: str = Field(default="beamlit-agent")
    base_url: str = Field(default="https://api.beamlit.dev/v0")
    run_url: str = Field(default="https://run.beamlit.dev")
    registry_url: str = Field(default="https://serverless-registry-production.beamlit.workers.dev")
    log_level: str = Field(default="INFO")
    agent: SettingsAgent = SettingsAgent()
    server: SettingsServer = SettingsServer()
    authentication: SettingsAuthentication = SettingsAuthentication()

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: Type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> Tuple[PydanticBaseSettingsSource, ...]:
        return (
            env_settings,
            dotenv_settings,
            file_secret_settings,
            YamlConfigSettingsSource(settings_cls),
            init_settings,
        )


def init_agent(
    client: AuthenticatedClient,
    destination: str = f"{os.getcwd()}/src/beamlit_generated.py",
):
    from beamlit.api.agents import get_agent_deployment
    from beamlit.common.generate import generate

    logger = getLogger(__name__)
    settings = get_settings()
    # Init configuration from environment variables
    if settings.agent.functions or settings.agent.chain:
        return

    # Init configuration from beamlit control plane
    name = settings.name
    env = settings.environment

    agent = get_agent.sync(name, environment=env, client=client)
    if not agent:
        raise ValueError(f"Agent {name} not found")
    functions: list[Function] = []
    agents_chain: list[Agent] = []
    if agent.spec.functions:
        for function in agent.spec.functions:
            function = get_function.sync(function, environment=env, client=client)
            if function:
                functions.append(function)
        settings.agent.functions = functions

    if agent.spec.agent_chain:
        for chain in agent.spec.agent_chain:
            if chain.enabled:
                agent_chain = get_agent.sync(chain.name, environment=env, client=client)
                if chain.description:
                    agent_chain.spec.description = chain.description
                agents_chain.append(agent_chain)
        settings.agent.chain = agents_chain
    if agent.spec.model:
        model = get_model.sync(agent.spec.model, environment=env, client=client)
        settings.agent.model = model

    content_generate = generate(destination, dry_run=True)
    compared_content = None
    if os.path.exists(destination):
        compared_content = open(destination).read()

    if not os.path.exists(destination) or (
        compared_content and content_generate != compared_content
    ):
        logger.info("Generating agent code")
        generate(destination)


def init() -> Settings:
    """Parse the beamlit.yaml file to get configurations."""
    from beamlit.authentication.credentials import current_context

    global SETTINGS

    context = current_context()
    kwargs = {}
    if context.workspace:
        kwargs["workspace"] = context.workspace
    if context.environment:
        kwargs["environment"] = context.environment

    SETTINGS = Settings(**kwargs)
    init_logger(SETTINGS.log_level)

    return SETTINGS
