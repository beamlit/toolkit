Module blaxel.models.api_key
============================

Classes
-------

`ApiKey(created_at: blaxel.types.Unset | str = <blaxel.types.Unset object>, updated_at: blaxel.types.Unset | str = <blaxel.types.Unset object>, created_by: blaxel.types.Unset | str = <blaxel.types.Unset object>, updated_by: blaxel.types.Unset | str = <blaxel.types.Unset object>, api_key: blaxel.types.Unset | str = <blaxel.types.Unset object>, expires_in: blaxel.types.Unset | str = <blaxel.types.Unset object>, id: blaxel.types.Unset | str = <blaxel.types.Unset object>, name: blaxel.types.Unset | str = <blaxel.types.Unset object>, sub: blaxel.types.Unset | str = <blaxel.types.Unset object>, sub_type: blaxel.types.Unset | str = <blaxel.types.Unset object>)`
:   Long-lived API key for accessing Blaxel
    
    Attributes:
        created_at (Union[Unset, str]): The date and time when the resource was created
        updated_at (Union[Unset, str]): The date and time when the resource was updated
        created_by (Union[Unset, str]): The user or service account who created the resource
        updated_by (Union[Unset, str]): The user or service account who updated the resource
        api_key (Union[Unset, str]): Api key
        expires_in (Union[Unset, str]): Duration until expiration (in seconds)
        id (Union[Unset, str]): Api key id, to retrieve it from the API
        name (Union[Unset, str]): Name for the API key
        sub (Union[Unset, str]): User subject identifier
        sub_type (Union[Unset, str]): Subject type
    
    Method generated by attrs for class ApiKey.

    ### Static methods

    `from_dict(src_dict: dict[str, typing.Any]) ‑> ~T`
    :

    ### Instance variables

    `additional_keys: list[str]`
    :

    `additional_properties: dict[str, typing.Any]`
    :

    `api_key: blaxel.types.Unset | str`
    :

    `created_at: blaxel.types.Unset | str`
    :

    `created_by: blaxel.types.Unset | str`
    :

    `expires_in: blaxel.types.Unset | str`
    :

    `id: blaxel.types.Unset | str`
    :

    `name: blaxel.types.Unset | str`
    :

    `sub: blaxel.types.Unset | str`
    :

    `sub_type: blaxel.types.Unset | str`
    :

    `updated_at: blaxel.types.Unset | str`
    :

    `updated_by: blaxel.types.Unset | str`
    :

    ### Methods

    `to_dict(self) ‑> dict[str, typing.Any]`
    :