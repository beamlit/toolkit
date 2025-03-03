Module blaxel.models.revision_configuration
===========================================

Classes
-------

`RevisionConfiguration(active: blaxel.types.Unset | str = <blaxel.types.Unset object>, canary: blaxel.types.Unset | str = <blaxel.types.Unset object>, canary_percent: blaxel.types.Unset | int = <blaxel.types.Unset object>, previous_active: blaxel.types.Unset | str = <blaxel.types.Unset object>, traffic: blaxel.types.Unset | int = <blaxel.types.Unset object>)`
:   Revision configuration
    
    Attributes:
        active (Union[Unset, str]): Active revision id
        canary (Union[Unset, str]): Canary revision id
        canary_percent (Union[Unset, int]): Canary revision percent
        previous_active (Union[Unset, str]): Previous active revision id
        traffic (Union[Unset, int]): Traffic percentage
    
    Method generated by attrs for class RevisionConfiguration.

    ### Static methods

    `from_dict(src_dict: dict[str, typing.Any]) ‑> ~T`
    :

    ### Instance variables

    `active: blaxel.types.Unset | str`
    :

    `additional_keys: list[str]`
    :

    `additional_properties: dict[str, typing.Any]`
    :

    `canary: blaxel.types.Unset | str`
    :

    `canary_percent: blaxel.types.Unset | int`
    :

    `previous_active: blaxel.types.Unset | str`
    :

    `traffic: blaxel.types.Unset | int`
    :

    ### Methods

    `to_dict(self) ‑> dict[str, typing.Any]`
    :