from typing import Any, TypeVar, Union, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="TraceIdsResponse")


@_attrs_define
class TraceIdsResponse:
    """Response containing trace IDs

    Attributes:
        trace_ids (Union[Unset, list[str]]): List of trace IDs
    """

    trace_ids: Union[Unset, list[str]] = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        trace_ids: Union[Unset, list[str]] = UNSET
        if not isinstance(self.trace_ids, Unset):
            trace_ids = self.trace_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if trace_ids is not UNSET:
            field_dict["trace_ids"] = trace_ids

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: dict[str, Any]) -> T:
        if not src_dict:
            return None
        d = src_dict.copy()
        trace_ids = cast(list[str], d.pop("trace_ids", UNSET))

        trace_ids_response = cls(
            trace_ids=trace_ids,
        )

        trace_ids_response.additional_properties = d
        return trace_ids_response

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
