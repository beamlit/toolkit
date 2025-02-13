from typing import TYPE_CHECKING, Any, TypeVar, Union, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.mcp_hub_artifact_entrypoint import MCPHubArtifactEntrypoint
    from ..models.mcp_hub_artifact_form import MCPHubArtifactForm


T = TypeVar("T", bound="MCPHubArtifact")


@_attrs_define
class MCPHubArtifact:
    """Artifact from the MCP Hub

    Attributes:
        categories (Union[Unset, list[Any]]): Categories of the artifact
        coming_soon (Union[Unset, bool]): If the artifact is coming soon
        description (Union[Unset, str]): Description of the artifact
        display_name (Union[Unset, str]): Display name of the artifact
        enterprise (Union[Unset, bool]): If the artifact is enterprise
        entrypoint (Union[Unset, MCPHubArtifactEntrypoint]): Entrypoint of the artifact
        form (Union[Unset, MCPHubArtifactForm]): Form of the artifact
        icon (Union[Unset, str]): Icon of the artifact
        integration (Union[Unset, str]): Integration of the artifact
        long_description (Union[Unset, str]): Long description of the artifact
        name (Union[Unset, str]): Name of the artifact
        url (Union[Unset, str]): URL of the artifact
    """

    categories: Union[Unset, list[Any]] = UNSET
    coming_soon: Union[Unset, bool] = UNSET
    description: Union[Unset, str] = UNSET
    display_name: Union[Unset, str] = UNSET
    enterprise: Union[Unset, bool] = UNSET
    entrypoint: Union[Unset, "MCPHubArtifactEntrypoint"] = UNSET
    form: Union[Unset, "MCPHubArtifactForm"] = UNSET
    icon: Union[Unset, str] = UNSET
    integration: Union[Unset, str] = UNSET
    long_description: Union[Unset, str] = UNSET
    name: Union[Unset, str] = UNSET
    url: Union[Unset, str] = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        categories: Union[Unset, list[Any]] = UNSET
        if not isinstance(self.categories, Unset):
            categories = self.categories

        coming_soon = self.coming_soon

        description = self.description

        display_name = self.display_name

        enterprise = self.enterprise

        entrypoint: Union[Unset, dict[str, Any]] = UNSET
        if self.entrypoint and not isinstance(self.entrypoint, Unset) and not isinstance(self.entrypoint, dict):
            entrypoint = self.entrypoint.to_dict()
        elif self.entrypoint and isinstance(self.entrypoint, dict):
            entrypoint = self.entrypoint

        form: Union[Unset, dict[str, Any]] = UNSET
        if self.form and not isinstance(self.form, Unset) and not isinstance(self.form, dict):
            form = self.form.to_dict()
        elif self.form and isinstance(self.form, dict):
            form = self.form

        icon = self.icon

        integration = self.integration

        long_description = self.long_description

        name = self.name

        url = self.url

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if categories is not UNSET:
            field_dict["categories"] = categories
        if coming_soon is not UNSET:
            field_dict["coming_soon"] = coming_soon
        if description is not UNSET:
            field_dict["description"] = description
        if display_name is not UNSET:
            field_dict["displayName"] = display_name
        if enterprise is not UNSET:
            field_dict["enterprise"] = enterprise
        if entrypoint is not UNSET:
            field_dict["entrypoint"] = entrypoint
        if form is not UNSET:
            field_dict["form"] = form
        if icon is not UNSET:
            field_dict["icon"] = icon
        if integration is not UNSET:
            field_dict["integration"] = integration
        if long_description is not UNSET:
            field_dict["longDescription"] = long_description
        if name is not UNSET:
            field_dict["name"] = name
        if url is not UNSET:
            field_dict["url"] = url

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: dict[str, Any]) -> T:
        from ..models.mcp_hub_artifact_entrypoint import MCPHubArtifactEntrypoint
        from ..models.mcp_hub_artifact_form import MCPHubArtifactForm

        if not src_dict:
            return None
        d = src_dict.copy()
        categories = cast(list[Any], d.pop("categories", UNSET))

        coming_soon = d.pop("coming_soon", UNSET)

        description = d.pop("description", UNSET)

        display_name = d.pop("displayName", UNSET)

        enterprise = d.pop("enterprise", UNSET)

        _entrypoint = d.pop("entrypoint", UNSET)
        entrypoint: Union[Unset, MCPHubArtifactEntrypoint]
        if isinstance(_entrypoint, Unset):
            entrypoint = UNSET
        else:
            entrypoint = MCPHubArtifactEntrypoint.from_dict(_entrypoint)

        _form = d.pop("form", UNSET)
        form: Union[Unset, MCPHubArtifactForm]
        if isinstance(_form, Unset):
            form = UNSET
        else:
            form = MCPHubArtifactForm.from_dict(_form)

        icon = d.pop("icon", UNSET)

        integration = d.pop("integration", UNSET)

        long_description = d.pop("longDescription", UNSET)

        name = d.pop("name", UNSET)

        url = d.pop("url", UNSET)

        mcp_hub_artifact = cls(
            categories=categories,
            coming_soon=coming_soon,
            description=description,
            display_name=display_name,
            enterprise=enterprise,
            entrypoint=entrypoint,
            form=form,
            icon=icon,
            integration=integration,
            long_description=long_description,
            name=name,
            url=url,
        )

        mcp_hub_artifact.additional_properties = d
        return mcp_hub_artifact

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
