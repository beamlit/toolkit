from http import HTTPStatus
from typing import Any, Optional, Union

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.agent_history import AgentHistory
from ...types import Response


def _get_kwargs(
    agent_name: str,
) -> dict[str, Any]:
    _kwargs: dict[str, Any] = {
        "method": "get",
        "url": f"/agents/{agent_name}/history",
    }

    return _kwargs


def _parse_response(
    *, client: Union[AuthenticatedClient, Client], response: httpx.Response
) -> Optional[list["AgentHistory"]]:
    if response.status_code == 200:
        response_200 = []
        _response_200 = response.json()
        for response_200_item_data in _response_200:
            response_200_item = AgentHistory.from_dict(response_200_item_data)

            response_200.append(response_200_item)

        return response_200
    if client.raise_on_unexpected_status:
        raise errors.UnexpectedStatus(response.status_code, response.content)
    else:
        return None


def _build_response(
    *, client: Union[AuthenticatedClient, Client], response: httpx.Response
) -> Response[list["AgentHistory"]]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    agent_name: str,
    *,
    client: AuthenticatedClient,
) -> Response[list["AgentHistory"]]:
    """
    Args:
        agent_name (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[list['AgentHistory']]
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
    client: AuthenticatedClient,
) -> Optional[list["AgentHistory"]]:
    """
    Args:
        agent_name (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        list['AgentHistory']
    """

    return sync_detailed(
        agent_name=agent_name,
        client=client,
    ).parsed


async def asyncio_detailed(
    agent_name: str,
    *,
    client: AuthenticatedClient,
) -> Response[list["AgentHistory"]]:
    """
    Args:
        agent_name (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[list['AgentHistory']]
    """

    kwargs = _get_kwargs(
        agent_name=agent_name,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    agent_name: str,
    *,
    client: AuthenticatedClient,
) -> Optional[list["AgentHistory"]]:
    """
    Args:
        agent_name (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        list['AgentHistory']
    """

    return (
        await asyncio_detailed(
            agent_name=agent_name,
            client=client,
        )
    ).parsed
