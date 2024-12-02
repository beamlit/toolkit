from http import HTTPStatus
from typing import Any, Optional, Union

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.store_agent import StoreAgent
from ...types import Response


def _get_kwargs(
    agent_name: str,
) -> dict[str, Any]:
    _kwargs: dict[str, Any] = {
        "method": "get",
        "url": f"/store/agents/{agent_name}",
    }

    return _kwargs


def _parse_response(*, client: Union[AuthenticatedClient, Client], response: httpx.Response) -> Optional[StoreAgent]:
    if response.status_code == 200:
        response_200 = StoreAgent.from_dict(response.json())

        return response_200
    if client.raise_on_unexpected_status:
        raise errors.UnexpectedStatus(response.status_code, response.content)
    else:
        return None


def _build_response(*, client: Union[AuthenticatedClient, Client], response: httpx.Response) -> Response[StoreAgent]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    agent_name: str,
    *,
    client: Union[AuthenticatedClient, Client],
) -> Response[StoreAgent]:
    """Get store agent by name

    Args:
        agent_name (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[StoreAgent]
    """

    kwargs = _get_kwargs(
        agent_name=agent_name,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    agent_name: str,
    *,
    client: Union[AuthenticatedClient, Client],
) -> Optional[StoreAgent]:
    """Get store agent by name

    Args:
        agent_name (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        StoreAgent
    """

    return sync_detailed(
        agent_name=agent_name,
        client=client,
    ).parsed


async def asyncio_detailed(
    agent_name: str,
    *,
    client: Union[AuthenticatedClient, Client],
) -> Response[StoreAgent]:
    """Get store agent by name

    Args:
        agent_name (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[StoreAgent]
    """

    kwargs = _get_kwargs(
        agent_name=agent_name,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    agent_name: str,
    *,
    client: Union[AuthenticatedClient, Client],
) -> Optional[StoreAgent]:
    """Get store agent by name

    Args:
        agent_name (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        StoreAgent
    """

    return (
        await asyncio_detailed(
            agent_name=agent_name,
            client=client,
        )
    ).parsed