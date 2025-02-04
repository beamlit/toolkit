from typing import TYPE_CHECKING, Any, TypeVar, Union, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.account_spec_address import AccountSpecAddress


T = TypeVar("T", bound="AccountSpec")


@_attrs_define
class AccountSpec:
    """AccountSpec

    Attributes:
        address (Union[Unset, AccountSpecAddress]): Billing address
        admins (Union[Unset, list[Any]]): Admins
        currency (Union[Unset, str]): Currency
        owner (Union[Unset, str]): Owner
        status (Union[Unset, str]): Status
        tax_id (Union[Unset, str]): Tax ID
    """

    address: Union[Unset, "AccountSpecAddress"] = UNSET
    admins: Union[Unset, list[Any]] = UNSET
    currency: Union[Unset, str] = UNSET
    owner: Union[Unset, str] = UNSET
    status: Union[Unset, str] = UNSET
    tax_id: Union[Unset, str] = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        address: Union[Unset, dict[str, Any]] = UNSET
        if self.address and not isinstance(self.address, Unset) and not isinstance(self.address, dict):
            address = self.address.to_dict()
        elif self.address and isinstance(self.address, dict):
            address = self.address

        admins: Union[Unset, list[Any]] = UNSET
        if not isinstance(self.admins, Unset):
            admins = self.admins

        currency = self.currency

        owner = self.owner

        status = self.status

        tax_id = self.tax_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if address is not UNSET:
            field_dict["address"] = address
        if admins is not UNSET:
            field_dict["admins"] = admins
        if currency is not UNSET:
            field_dict["currency"] = currency
        if owner is not UNSET:
            field_dict["owner"] = owner
        if status is not UNSET:
            field_dict["status"] = status
        if tax_id is not UNSET:
            field_dict["tax_id"] = tax_id

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: dict[str, Any]) -> T:
        from ..models.account_spec_address import AccountSpecAddress

        if not src_dict:
            return None
        d = src_dict.copy()
        _address = d.pop("address", UNSET)
        address: Union[Unset, AccountSpecAddress]
        if isinstance(_address, Unset):
            address = UNSET
        else:
            address = AccountSpecAddress.from_dict(_address)

        admins = cast(list[Any], d.pop("admins", UNSET))

        currency = d.pop("currency", UNSET)

        owner = d.pop("owner", UNSET)

        status = d.pop("status", UNSET)

        tax_id = d.pop("tax_id", UNSET)

        account_spec = cls(
            address=address,
            admins=admins,
            currency=currency,
            owner=owner,
            status=status,
            tax_id=tax_id,
        )

        account_spec.additional_properties = d
        return account_spec

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
