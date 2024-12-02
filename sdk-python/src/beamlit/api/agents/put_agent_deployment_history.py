from http import HTTPStatus
from typing import Any, Optional, Union

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.agent_deployment_history import AgentDeploymentHistory
from ...types import Response


def _get_kwargs(
    agent_name: str,
    environment_name: str,
    request_id: str,
    *,
    body: AgentDeploymentHistory,
) -> dict[str, Any]:
    headers: dict[str, Any] = {}

    _kwargs: dict[str, Any] = {
        "method": "put",
        "url": f"/agents/{agent_name}/deployments/{environment_name}/history/{request_id}",
    }

    _body = body.to_dict()

    _kwargs["json"] = _body
    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(
    *, client: Union[AuthenticatedClient, Client], response: httpx.Response
) -> Optional[AgentDeploymentHistory]:
    if response.status_code == 200:
        response_200 = AgentDeploymentHistory.from_dict(response.json())

        return response_200
    if client.raise_on_unexpected_status:
        raise errors.UnexpectedStatus(response.status_code, response.content)
    else:
        return None


def _build_response(
    *, client: Union[AuthenticatedClient, Client], response: httpx.Response
) -> Response[AgentDeploymentHistory]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    agent_name: str,
    environment_name: str,
    request_id: str,
    *,
    client: AuthenticatedClient,
    body: AgentDeploymentHistory,
) -> Response[AgentDeploymentHistory]:
    """Update agent's history by request ID

    Args:
        agent_name (str):
        environment_name (str):
        request_id (str):
        body (AgentDeploymentHistory): Agent deployment history

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[AgentDeploymentHistory]
    """

    kwargs = _get_kwargs(
        agent_name=agent_name,
        environment_name=environment_name,
        request_id=request_id,
        body=body,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    agent_name: str,
    environment_name: str,
    request_id: str,
    *,
    client: AuthenticatedClient,
    body: AgentDeploymentHistory,
) -> Optional[AgentDeploymentHistory]:
    """Update agent's history by request ID

    Args:
        agent_name (str):
        environment_name (str):
        request_id (str):
        body (AgentDeploymentHistory): Agent deployment history

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        AgentDeploymentHistory
    """

    return sync_detailed(
        agent_name=agent_name,
        environment_name=environment_name,
        request_id=request_id,
        client=client,
        body=body,
    ).parsed


async def asyncio_detailed(
    agent_name: str,
    environment_name: str,
    request_id: str,
    *,
    client: AuthenticatedClient,
    body: AgentDeploymentHistory,
) -> Response[AgentDeploymentHistory]:
    """Update agent's history by request ID

    Args:
        agent_name (str):
        environment_name (str):
        request_id (str):
        body (AgentDeploymentHistory): Agent deployment history

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[AgentDeploymentHistory]
    """

    kwargs = _get_kwargs(
        agent_name=agent_name,
        environment_name=environment_name,
        request_id=request_id,
        body=body,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    agent_name: str,
    environment_name: str,
    request_id: str,
    *,
    client: AuthenticatedClient,
    body: AgentDeploymentHistory,
) -> Optional[AgentDeploymentHistory]:
    """Update agent's history by request ID

    Args:
        agent_name (str):
        environment_name (str):
        request_id (str):
        body (AgentDeploymentHistory): Agent deployment history

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        AgentDeploymentHistory
    """

    return (
        await asyncio_detailed(
            agent_name=agent_name,
            environment_name=environment_name,
            request_id=request_id,
            client=client,
            body=body,
        )
    ).parsed