from typing import Any, TypeVar, Union

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="ApiKey")


@_attrs_define
class ApiKey:
    """Long-lived API key for accessing Beamlit

    Attributes:
        created_at (Union[Unset, str]): The date and time when the resource was created
        created_by (Union[Unset, str]): The user or service account who created the resource
        updated_at (Union[Unset, str]): The date and time when the resource was updated
        updated_by (Union[Unset, str]): The user or service account who updated the resource
        api_key (Union[Unset, str]): Api key
        expires_in (Union[Unset, str]): Duration until expiration (in seconds)
        id (Union[Unset, str]): Api key id, to retrieve it from the API
        name (Union[Unset, str]): Name for the API key
        sub (Union[Unset, str]): User subject identifier
        sub_type (Union[Unset, str]): Subject type
    """

    created_at: Union[Unset, str] = UNSET
    created_by: Union[Unset, str] = UNSET
    updated_at: Union[Unset, str] = UNSET
    updated_by: Union[Unset, str] = UNSET
    api_key: Union[Unset, str] = UNSET
    expires_in: Union[Unset, str] = UNSET
    id: Union[Unset, str] = UNSET
    name: Union[Unset, str] = UNSET
    sub: Union[Unset, str] = UNSET
    sub_type: Union[Unset, str] = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        created_at = self.created_at

        created_by = self.created_by

        updated_at = self.updated_at

        updated_by = self.updated_by

        api_key = self.api_key

        expires_in = self.expires_in

        id = self.id

        name = self.name

        sub = self.sub

        sub_type = self.sub_type

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if created_at is not UNSET:
            field_dict["created_at"] = created_at
        if created_by is not UNSET:
            field_dict["created_by"] = created_by
        if updated_at is not UNSET:
            field_dict["updated_at"] = updated_at
        if updated_by is not UNSET:
            field_dict["updated_by"] = updated_by
        if api_key is not UNSET:
            field_dict["api_key"] = api_key
        if expires_in is not UNSET:
            field_dict["expires_in"] = expires_in
        if id is not UNSET:
            field_dict["id"] = id
        if name is not UNSET:
            field_dict["name"] = name
        if sub is not UNSET:
            field_dict["sub"] = sub
        if sub_type is not UNSET:
            field_dict["sub_type"] = sub_type

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: dict[str, Any]) -> T:
        if not src_dict:
            return None
        d = src_dict.copy()
        created_at = d.pop("created_at", UNSET)

        created_by = d.pop("created_by", UNSET)

        updated_at = d.pop("updated_at", UNSET)

        updated_by = d.pop("updated_by", UNSET)

        api_key = d.pop("api_key", UNSET)

        expires_in = d.pop("expires_in", UNSET)

        id = d.pop("id", UNSET)

        name = d.pop("name", UNSET)

        sub = d.pop("sub", UNSET)

        sub_type = d.pop("sub_type", UNSET)

        api_key = cls(
            created_at=created_at,
            created_by=created_by,
            updated_at=updated_at,
            updated_by=updated_by,
            api_key=api_key,
            expires_in=expires_in,
            id=id,
            name=name,
            sub=sub,
            sub_type=sub_type,
        )

        api_key.additional_properties = d
        return api_key

    @property
    def additional_keys(self) -> list[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
