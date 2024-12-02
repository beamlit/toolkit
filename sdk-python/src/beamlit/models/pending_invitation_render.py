from typing import TYPE_CHECKING, Any, Dict, Type, TypeVar, Union

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.pending_invitation_render_invited_by import PendingInvitationRenderInvitedBy
    from ..models.pending_invitation_render_workspace import PendingInvitationRenderWorkspace
    from ..models.pending_invitation_workspace_details import PendingInvitationWorkspaceDetails


T = TypeVar("T", bound="PendingInvitationRender")


@_attrs_define
class PendingInvitationRender:
    """Pending invitation in workspace

    Attributes:
        email (Union[Unset, str]): User email
        invited_at (Union[Unset, str]): Invitation date
        invited_by (Union[Unset, PendingInvitationRenderInvitedBy]): Invited by
        role (Union[Unset, str]): ACL role
        workspace (Union[Unset, PendingInvitationRenderWorkspace]): Workspace
        workspace_details (Union[Unset, PendingInvitationWorkspaceDetails]): Workspace details
    """

    email: Union[Unset, str] = UNSET
    invited_at: Union[Unset, str] = UNSET
    invited_by: Union[Unset, "PendingInvitationRenderInvitedBy"] = UNSET
    role: Union[Unset, str] = UNSET
    workspace: Union[Unset, "PendingInvitationRenderWorkspace"] = UNSET
    workspace_details: Union[Unset, "PendingInvitationWorkspaceDetails"] = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        email = self.email

        invited_at = self.invited_at

        invited_by: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.invited_by, Unset):
            invited_by = self.invited_by.to_dict()

        role = self.role

        workspace: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.workspace, Unset):
            workspace = self.workspace.to_dict()

        workspace_details: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.workspace_details, Unset):
            workspace_details = self.workspace_details.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if email is not UNSET:
            field_dict["email"] = email
        if invited_at is not UNSET:
            field_dict["invited_at"] = invited_at
        if invited_by is not UNSET:
            field_dict["invited_by"] = invited_by
        if role is not UNSET:
            field_dict["role"] = role
        if workspace is not UNSET:
            field_dict["workspace"] = workspace
        if workspace_details is not UNSET:
            field_dict["workspace_details"] = workspace_details

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: dict[str, Any]) -> T:
        from ..models.pending_invitation_render_invited_by import PendingInvitationRenderInvitedBy
        from ..models.pending_invitation_render_workspace import PendingInvitationRenderWorkspace
        from ..models.pending_invitation_workspace_details import PendingInvitationWorkspaceDetails

        d = src_dict.copy()
        email = d.pop("email", UNSET)

        invited_at = d.pop("invited_at", UNSET)

        _invited_by = d.pop("invited_by", UNSET)
        invited_by: Union[Unset, PendingInvitationRenderInvitedBy]
        if isinstance(_invited_by, Unset):
            invited_by = UNSET
        else:
            invited_by = PendingInvitationRenderInvitedBy.from_dict(_invited_by)

        role = d.pop("role", UNSET)

        _workspace = d.pop("workspace", UNSET)
        workspace: Union[Unset, PendingInvitationRenderWorkspace]
        if isinstance(_workspace, Unset):
            workspace = UNSET
        else:
            workspace = PendingInvitationRenderWorkspace.from_dict(_workspace)

        _workspace_details = d.pop("workspace_details", UNSET)
        workspace_details: Union[Unset, PendingInvitationWorkspaceDetails]
        if isinstance(_workspace_details, Unset):
            workspace_details = UNSET
        else:
            workspace_details = PendingInvitationWorkspaceDetails.from_dict(_workspace_details)

        pending_invitation_render = cls(
            email=email,
            invited_at=invited_at,
            invited_by=invited_by,
            role=role,
            workspace=workspace,
            workspace_details=workspace_details,
        )

        pending_invitation_render.additional_properties = d
        return pending_invitation_render

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