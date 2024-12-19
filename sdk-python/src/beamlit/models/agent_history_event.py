from typing import Any, TypeVar, Union

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="AgentHistoryEvent")


@_attrs_define
class AgentHistoryEvent:
    """Agent deployment history event

    Attributes:
        end (Union[Unset, str]): End time
        error (Union[Unset, str]): Error message
        name (Union[Unset, str]): Name of the function or agent
        parameters (Union[Unset, str]): Parameters
        start (Union[Unset, str]): Start time
        status (Union[Unset, str]): Status, eg: running, success, failed
        sub_function (Union[Unset, str]): Function used in kit if a kit was used
        took (Union[Unset, int]): Number of milliseconds it took to complete the event
        type_ (Union[Unset, str]): Type, one of function or agent
    """

    end: Union[Unset, str] = UNSET
    error: Union[Unset, str] = UNSET
    name: Union[Unset, str] = UNSET
    parameters: Union[Unset, str] = UNSET
    start: Union[Unset, str] = UNSET
    status: Union[Unset, str] = UNSET
    sub_function: Union[Unset, str] = UNSET
    took: Union[Unset, int] = UNSET
    type_: Union[Unset, str] = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        end = self.end

        error = self.error

        name = self.name

        parameters = self.parameters

        start = self.start

        status = self.status

        sub_function = self.sub_function

        took = self.took

        type_ = self.type_

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if end is not UNSET:
            field_dict["end"] = end
        if error is not UNSET:
            field_dict["error"] = error
        if name is not UNSET:
            field_dict["name"] = name
        if parameters is not UNSET:
            field_dict["parameters"] = parameters
        if start is not UNSET:
            field_dict["start"] = start
        if status is not UNSET:
            field_dict["status"] = status
        if sub_function is not UNSET:
            field_dict["sub_function"] = sub_function
        if took is not UNSET:
            field_dict["took"] = took
        if type_ is not UNSET:
            field_dict["type"] = type_

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: dict[str, Any]) -> T:
        if not src_dict:
            return None
        d = src_dict.copy()
        end = d.pop("end", UNSET)

        error = d.pop("error", UNSET)

        name = d.pop("name", UNSET)

        parameters = d.pop("parameters", UNSET)

        start = d.pop("start", UNSET)

        status = d.pop("status", UNSET)

        sub_function = d.pop("sub_function", UNSET)

        took = d.pop("took", UNSET)

        type_ = d.pop("type", UNSET)

        agent_history_event = cls(
            end=end,
            error=error,
            name=name,
            parameters=parameters,
            start=start,
            status=status,
            sub_function=sub_function,
            took=took,
            type_=type_,
        )

        agent_history_event.additional_properties = d
        return agent_history_event

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
