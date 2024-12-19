from typing import TYPE_CHECKING, Any, TypeVar, Union

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.environment_spec import EnvironmentSpec
    from ..models.metadata import Metadata


T = TypeVar("T", bound="Environment")


@_attrs_define
class Environment:
    """Environment on which deployments will be made (e.g. development, production), enforcing multiple policies at once.

    Attributes:
        metadata (Union[Unset, Metadata]): Metadata
        spec (Union[Unset, EnvironmentSpec]): Environment specification
    """

    metadata: Union[Unset, "Metadata"] = UNSET
    spec: Union[Unset, "EnvironmentSpec"] = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        metadata: Union[Unset, dict[str, Any]] = UNSET
        if not isinstance(self.metadata, Unset):
            metadata = self.metadata.to_dict()

        spec: Union[Unset, dict[str, Any]] = UNSET
        if not isinstance(self.spec, Unset):
            spec = self.spec.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if metadata is not UNSET:
            field_dict["metadata"] = metadata
        if spec is not UNSET:
            field_dict["spec"] = spec

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: dict[str, Any]) -> T:
        from ..models.environment_spec import EnvironmentSpec
        from ..models.metadata import Metadata

        if not src_dict:
            return None
        d = src_dict.copy()
        _metadata = d.pop("metadata", UNSET)
        metadata: Union[Unset, Metadata]
        if isinstance(_metadata, Unset):
            metadata = UNSET
        else:
            metadata = Metadata.from_dict(_metadata)

        _spec = d.pop("spec", UNSET)
        spec: Union[Unset, EnvironmentSpec]
        if isinstance(_spec, Unset):
            spec = UNSET
        else:
            spec = EnvironmentSpec.from_dict(_spec)

        environment = cls(
            metadata=metadata,
            spec=spec,
        )

        environment.additional_properties = d
        return environment

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
