from typing import TYPE_CHECKING, Any, TypeVar, Union

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.core_event import CoreEvent
    from ..models.environment_metadata import EnvironmentMetadata
    from ..models.function_spec import FunctionSpec


T = TypeVar("T", bound="Function")


@_attrs_define
class Function:
    """Function

    Attributes:
        events (Union[Unset, list['CoreEvent']]): Core events
        metadata (Union[Unset, EnvironmentMetadata]): Environment metadata
        spec (Union[Unset, FunctionSpec]): Function specification
    """

    events: Union[Unset, list["CoreEvent"]] = UNSET
    metadata: Union[Unset, "EnvironmentMetadata"] = UNSET
    spec: Union[Unset, "FunctionSpec"] = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        events: Union[Unset, list[dict[str, Any]]] = UNSET
        if not isinstance(self.events, Unset):
            events = []
            for componentsschemas_core_events_item_data in self.events:
                componentsschemas_core_events_item = componentsschemas_core_events_item_data.to_dict()
                events.append(componentsschemas_core_events_item)

        metadata: Union[Unset, dict[str, Any]] = UNSET
        if self.metadata and not isinstance(self.metadata, Unset):
            metadata = self.metadata.to_dict()

        spec: Union[Unset, dict[str, Any]] = UNSET
        if self.spec and not isinstance(self.spec, Unset):
            spec = self.spec.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if events is not UNSET:
            field_dict["events"] = events
        if metadata is not UNSET:
            field_dict["metadata"] = metadata
        if spec is not UNSET:
            field_dict["spec"] = spec

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: dict[str, Any]) -> T:
        from ..models.core_event import CoreEvent
        from ..models.environment_metadata import EnvironmentMetadata
        from ..models.function_spec import FunctionSpec

        if not src_dict:
            return None
        d = src_dict.copy()
        events = []
        _events = d.pop("events", UNSET)
        for componentsschemas_core_events_item_data in _events or []:
            componentsschemas_core_events_item = CoreEvent.from_dict(componentsschemas_core_events_item_data)

            events.append(componentsschemas_core_events_item)

        _metadata = d.pop("metadata", UNSET)
        metadata: Union[Unset, EnvironmentMetadata]
        if isinstance(_metadata, Unset):
            metadata = UNSET
        else:
            metadata = EnvironmentMetadata.from_dict(_metadata)

        _spec = d.pop("spec", UNSET)
        spec: Union[Unset, FunctionSpec]
        if isinstance(_spec, Unset):
            spec = UNSET
        else:
            spec = FunctionSpec.from_dict(_spec)

        function = cls(
            events=events,
            metadata=metadata,
            spec=spec,
        )

        function.additional_properties = d
        return function

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
