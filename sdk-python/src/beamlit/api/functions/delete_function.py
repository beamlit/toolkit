from http import HTTPStatus
from typing import Any, Optional, Union

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.function_render import FunctionRender
from ...types import UNSET, Response


def _get_kwargs(
    function_name: str,
    *,
    environment: str,
) -> dict[str, Any]:
    params: dict[str, Any] = {}

    params["environment"] = environment

    params = {k: v for k, v in params.items() if v is not UNSET and v is not None}

    _kwargs: dict[str, Any] = {
        "method": "delete",
        "url": f"/functions/{function_name}",
        "params": params,
    }

    return _kwargs


def _parse_response(
    *, client: Union[AuthenticatedClient, Client], response: httpx.Response
) -> Optional[FunctionRender]:
    if response.status_code == 200:
        response_200 = FunctionRender.from_dict(response.json())

        return response_200
    if client.raise_on_unexpected_status:
        raise errors.UnexpectedStatus(response.status_code, response.content)
    else:
        return None


def _build_response(
    *, client: Union[AuthenticatedClient, Client], response: httpx.Response
) -> Response[FunctionRender]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    function_name: str,
    *,
    client: AuthenticatedClient,
    environment: str,
) -> Response[FunctionRender]:
    """Delete function by name

    Args:
        function_name (str):
        environment (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[FunctionRender]
    """

    kwargs = _get_kwargs(
        function_name=function_name,
        environment=environment,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    function_name: str,
    *,
    client: AuthenticatedClient,
    environment: str,
) -> Optional[FunctionRender]:
    """Delete function by name

    Args:
        function_name (str):
        environment (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        FunctionRender
    """

    return sync_detailed(
        function_name=function_name,
        client=client,
        environment=environment,
    ).parsed


async def asyncio_detailed(
    function_name: str,
    *,
    client: AuthenticatedClient,
    environment: str,
) -> Response[FunctionRender]:
    """Delete function by name

    Args:
        function_name (str):
        environment (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[FunctionRender]
    """

    kwargs = _get_kwargs(
        function_name=function_name,
        environment=environment,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    function_name: str,
    *,
    client: AuthenticatedClient,
    environment: str,
) -> Optional[FunctionRender]:
    """Delete function by name

    Args:
        function_name (str):
        environment (str):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        FunctionRender
    """

    return (
        await asyncio_detailed(
            function_name=function_name,
            client=client,
            environment=environment,
        )
    ).parsed
