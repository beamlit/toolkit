from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.flavor import Flavor
    from ..models.pod_template_spec import PodTemplateSpec
    from ..models.runtime import Runtime
    from ..models.serverless_config import ServerlessConfig
    from ..models.spec_configuration import SpecConfiguration


T = TypeVar("T", bound="ModelSpec")


@_attrs_define
class ModelSpec:
    """Model specification

    Attributes:
        configurations (Union[Unset, SpecConfiguration]): Agent configuration, this is a key value storage. In your
            agent you can retrieve the value with config[key]
        enabled (Union[Unset, bool]): Enable or disable the agent
        flavors (Union[Unset, List['Flavor']]): Types of hardware available for deployments
        integration_connections (Union[Unset, List[str]]):
        pod_template (Union[Unset, PodTemplateSpec]): Pod template specification
        policies (Union[Unset, List[str]]):
        runtime (Union[Unset, Runtime]): Set of configurations for a deployment
        serverless_config (Union[Unset, ServerlessConfig]): Configuration for a serverless deployment
        model_provider (Union[Unset, str]): Model provider name
    """

    configurations: Union[Unset, "SpecConfiguration"] = UNSET
    enabled: Union[Unset, bool] = UNSET
    flavors: Union[Unset, List["Flavor"]] = UNSET
    integration_connections: Union[Unset, List[str]] = UNSET
    pod_template: Union[Unset, "PodTemplateSpec"] = UNSET
    policies: Union[Unset, List[str]] = UNSET
    runtime: Union[Unset, "Runtime"] = UNSET
    serverless_config: Union[Unset, "ServerlessConfig"] = UNSET
    model_provider: Union[Unset, str] = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        configurations: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.configurations, Unset):
            configurations = self.configurations.to_dict()

        enabled = self.enabled

        flavors: Union[Unset, List[Dict[str, Any]]] = UNSET
        if not isinstance(self.flavors, Unset):
            flavors = []
            for componentsschemas_flavors_item_data in self.flavors:
                componentsschemas_flavors_item = (
                    componentsschemas_flavors_item_data.to_dict()
                )
                flavors.append(componentsschemas_flavors_item)

        integration_connections: Union[Unset, List[str]] = UNSET
        if not isinstance(self.integration_connections, Unset):
            integration_connections = self.integration_connections

        pod_template: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.pod_template, Unset):
            pod_template = self.pod_template.to_dict()

        policies: Union[Unset, List[str]] = UNSET
        if not isinstance(self.policies, Unset):
            policies = self.policies

        runtime: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.runtime, Unset):
            runtime = self.runtime.to_dict()

        serverless_config: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.serverless_config, Unset):
            serverless_config = self.serverless_config.to_dict()

        model_provider = self.model_provider

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if configurations is not UNSET:
            field_dict["configurations"] = configurations
        if enabled is not UNSET:
            field_dict["enabled"] = enabled
        if flavors is not UNSET:
            field_dict["flavors"] = flavors
        if integration_connections is not UNSET:
            field_dict["integrationConnections"] = integration_connections
        if pod_template is not UNSET:
            field_dict["podTemplate"] = pod_template
        if policies is not UNSET:
            field_dict["policies"] = policies
        if runtime is not UNSET:
            field_dict["runtime"] = runtime
        if serverless_config is not UNSET:
            field_dict["serverlessConfig"] = serverless_config
        if model_provider is not UNSET:
            field_dict["modelProvider"] = model_provider

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: dict[str, Any]) -> T:
        from ..models.flavor import Flavor
        from ..models.pod_template_spec import PodTemplateSpec
        from ..models.runtime import Runtime
        from ..models.serverless_config import ServerlessConfig
        from ..models.spec_configuration import SpecConfiguration

        d = src_dict.copy()
        _configurations = d.pop("configurations", UNSET)
        configurations: Union[Unset, SpecConfiguration]
        if isinstance(_configurations, Unset):
            configurations = UNSET
        else:
            configurations = SpecConfiguration.from_dict(_configurations)

        enabled = d.pop("enabled", UNSET)

        flavors = []
        _flavors = d.pop("flavors", UNSET)
        for componentsschemas_flavors_item_data in _flavors or []:
            componentsschemas_flavors_item = Flavor.from_dict(
                componentsschemas_flavors_item_data
            )

            flavors.append(componentsschemas_flavors_item)

        integration_connections = cast(
            List[str], d.pop("integrationConnections", UNSET)
        )

        _pod_template = d.pop("podTemplate", UNSET)
        pod_template: Union[Unset, PodTemplateSpec]
        if isinstance(_pod_template, Unset):
            pod_template = UNSET
        else:
            pod_template = PodTemplateSpec.from_dict(_pod_template)

        policies = cast(List[str], d.pop("policies", UNSET))

        _runtime = d.pop("runtime", UNSET)
        runtime: Union[Unset, Runtime]
        if isinstance(_runtime, Unset):
            runtime = UNSET
        else:
            runtime = Runtime.from_dict(_runtime)

        _serverless_config = d.pop("serverlessConfig", UNSET)
        serverless_config: Union[Unset, ServerlessConfig]
        if isinstance(_serverless_config, Unset):
            serverless_config = UNSET
        else:
            serverless_config = ServerlessConfig.from_dict(_serverless_config)

        model_provider = d.pop("modelProvider", UNSET)

        model_spec = cls(
            configurations=configurations,
            enabled=enabled,
            flavors=flavors,
            integration_connections=integration_connections,
            pod_template=pod_template,
            policies=policies,
            runtime=runtime,
            serverless_config=serverless_config,
            model_provider=model_provider,
        )

        model_spec.additional_properties = d
        return model_spec

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