from typing import TYPE_CHECKING, Any, TypeVar, Union

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.metadata_labels import MetadataLabels
    from ..models.provider_config import ProviderConfig


T = TypeVar("T", bound="ModelProvider")


@_attrs_define
class ModelProvider:
    """Model provider

    Attributes:
        created_at (Union[Unset, str]): The date and time when the resource was created
        updated_at (Union[Unset, str]): The date and time when the resource was updated
        created_by (Union[Unset, str]): The user or service account who created the resource
        updated_by (Union[Unset, str]): The user or service account who updated the resource
        comment (Union[Unset, str]): Model provider description
        config (Union[Unset, ProviderConfig]): Model provider config
        display_name (Union[Unset, str]): Model provider display name
        labels (Union[Unset, MetadataLabels]): Labels
        name (Union[Unset, str]): Model provider name
        type_ (Union[Unset, str]): Model provider type
        workspace (Union[Unset, str]): Workspace name
    """

    created_at: Union[Unset, str] = UNSET
    updated_at: Union[Unset, str] = UNSET
    created_by: Union[Unset, str] = UNSET
    updated_by: Union[Unset, str] = UNSET
    comment: Union[Unset, str] = UNSET
    config: Union[Unset, "ProviderConfig"] = UNSET
    display_name: Union[Unset, str] = UNSET
    labels: Union[Unset, "MetadataLabels"] = UNSET
    name: Union[Unset, str] = UNSET
    type_: Union[Unset, str] = UNSET
    workspace: Union[Unset, str] = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        created_at = self.created_at

        updated_at = self.updated_at

        created_by = self.created_by

        updated_by = self.updated_by

        comment = self.comment

        config: Union[Unset, dict[str, Any]] = UNSET
        if not isinstance(self.config, Unset):
            config = self.config.to_dict()

        display_name = self.display_name

        labels: Union[Unset, dict[str, Any]] = UNSET
        if not isinstance(self.labels, Unset):
            labels = self.labels.to_dict()

        name = self.name

        type_ = self.type_

        workspace = self.workspace

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if created_at is not UNSET:
            field_dict["createdAt"] = created_at
        if updated_at is not UNSET:
            field_dict["updatedAt"] = updated_at
        if created_by is not UNSET:
            field_dict["createdBy"] = created_by
        if updated_by is not UNSET:
            field_dict["updatedBy"] = updated_by
        if comment is not UNSET:
            field_dict["comment"] = comment
        if config is not UNSET:
            field_dict["config"] = config
        if display_name is not UNSET:
            field_dict["display_name"] = display_name
        if labels is not UNSET:
            field_dict["labels"] = labels
        if name is not UNSET:
            field_dict["name"] = name
        if type_ is not UNSET:
            field_dict["type"] = type_
        if workspace is not UNSET:
            field_dict["workspace"] = workspace

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: dict[str, Any]) -> T:
        from ..models.metadata_labels import MetadataLabels
        from ..models.provider_config import ProviderConfig

        if not src_dict:
            return None
        d = src_dict.copy()
        created_at = d.pop("createdAt", UNSET)

        updated_at = d.pop("updatedAt", UNSET)

        created_by = d.pop("createdBy", UNSET)

        updated_by = d.pop("updatedBy", UNSET)

        comment = d.pop("comment", UNSET)

        _config = d.pop("config", UNSET)
        config: Union[Unset, ProviderConfig]
        if isinstance(_config, Unset):
            config = UNSET
        else:
            config = ProviderConfig.from_dict(_config)

        display_name = d.pop("display_name", UNSET)

        _labels = d.pop("labels", UNSET)
        labels: Union[Unset, MetadataLabels]
        if isinstance(_labels, Unset):
            labels = UNSET
        else:
            labels = MetadataLabels.from_dict(_labels)

        name = d.pop("name", UNSET)

        type_ = d.pop("type", UNSET)

        workspace = d.pop("workspace", UNSET)

        model_provider = cls(
            created_at=created_at,
            updated_at=updated_at,
            created_by=created_by,
            updated_by=updated_by,
            comment=comment,
            config=config,
            display_name=display_name,
            labels=labels,
            name=name,
            type_=type_,
            workspace=workspace,
        )

        model_provider.additional_properties = d
        return model_provider

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
