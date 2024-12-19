from logging import getLogger

from beamlit.authentication import get_authentication_headers, new_client
from beamlit.common.settings import get_settings
from beamlit.models import Model

logger = getLogger(__name__)


def get_base_url(agent_model: Model):
    settings = get_settings()
    return f"{settings.run_url}/{settings.workspace}/models/{agent_model.metadata.name}/v1"


def get_mistral_chat_model(**kwargs):
    from langchain_mistralai.chat_models import ChatMistralAI  # type: ignore

    return ChatMistralAI(**kwargs)


def get_openai_chat_model(**kwargs):
    from langchain_openai import ChatOpenAI  # type: ignore

    return ChatOpenAI(**kwargs)


def get_anthropic_chat_model(**kwargs):
    from langchain_anthropic import ChatAnthropic  # type: ignore

    return ChatAnthropic(**kwargs)

def get_xai_chat_model(**kwargs):
    from langchain_xai import ChatXAI  # type: ignore

    return ChatXAI(**kwargs)

def get_cohere_chat_model(**kwargs):
    from langchain_cohere import ChatCohere  # type: ignore

    return ChatCohere(**kwargs)

def get_chat_model(agent_model: Model):
    settings = get_settings()
    client = new_client()

    headers = get_authentication_headers(settings)
    headers["X-Beamlit-Environment"] = agent_model.metadata.environment

    jwt = headers.get("X-Beamlit-Authorization", "").replace("Bearer ", "")
    params = {"environment": agent_model.metadata.environment}
    chat_classes = {
        "openai": {
            "func": get_openai_chat_model,
            "kwargs": {
                "http_async_client": client.get_async_httpx_client(),
                "http_client": client.get_httpx_client(),
            },
        },
        "anthropic": {
            "func": get_anthropic_chat_model,
            "kwargs": {},
        },
        "mistral": {
            "func": get_mistral_chat_model,
            "kwargs": {
                "api_key": jwt,
            },
        },
        "xai": {
            "func": get_xai_chat_model,
            "kwargs": {
                "api_key": jwt,
                "xai_api_base": get_base_url(),
            },
            "remove_kwargs": ["base_url"],
        },
        "cohere": {
            "func": get_cohere_chat_model,
            "kwargs": {
                "cohere_api_key": jwt,
            },
        },
    }

    if agent_model is None:
        raise ValueError("agent_model not found in configuration")
    if agent_model.spec.runtime is None:
        raise ValueError("runtime not found in agent model")
    if agent_model.spec.runtime.type_ is None:
        raise ValueError("type not found in runtime")
    if agent_model.spec.runtime.model is None:
        raise ValueError("model not found in runtime")

    provider = agent_model.spec.runtime.type_
    model = agent_model.spec.runtime.model

    kwargs = {
        "model": model,
        "base_url": get_base_url(agent_model),
        "default_query": params,
        "default_headers": headers,
        "api_key": "fake_api_key",
        "temperature": 0,
    }
    chat_class = chat_classes.get(provider)
    if not chat_class:
        logger.warning(f"Provider {provider} not currently supported, defaulting to OpenAI")
        chat_class = chat_classes["openai"]
    if "kwargs" in chat_class:
        kwargs.update(chat_class["kwargs"])
    if "remove_kwargs" in chat_class:
        for key in chat_class["remove_kwargs"]:
            kwargs.pop(key, None)
    return chat_class["func"](**kwargs)
