from typing import TYPE_CHECKING, Any, TypeVar, Union

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.metric import Metric
    from ..models.qps import QPS
    from ..models.resource_deployment_metrics_inference_per_second_per_region import (
        ResourceDeploymentMetricsInferencePerSecondPerRegion,
    )
    from ..models.resource_deployment_metrics_query_per_second_per_region_per_code import (
        ResourceDeploymentMetricsQueryPerSecondPerRegionPerCode,
    )


T = TypeVar("T", bound="ResourceDeploymentMetrics")


@_attrs_define
class ResourceDeploymentMetrics:
    """Metrics for a single resource deployment (eg. model deployment, function deployment)

    Attributes:
        inference_per_second_global (Union[Unset, list['Metric']]): Array of metrics
        inference_per_second_per_region (Union[Unset, ResourceDeploymentMetricsInferencePerSecondPerRegion]): Historical
            requests per second (RPS) per location, for the model deployment
        query_per_second_global (Union[Unset, float]): RPS value (in last 24 hours) for the model deployment globally
        query_per_second_per_code_global (Union[Unset, QPS]): Query per second per element, can be per response status
            code (e.g. 200, 400) or per location
        query_per_second_per_region (Union[Unset, QPS]): Query per second per element, can be per response status code
            (e.g. 200, 400) or per location
        query_per_second_per_region_per_code (Union[Unset, ResourceDeploymentMetricsQueryPerSecondPerRegionPerCode]):
            RPS value (in last 24 hours) per response status code per location, for the model deployment
    """

    inference_per_second_global: Union[Unset, list["Metric"]] = UNSET
    inference_per_second_per_region: Union[Unset, "ResourceDeploymentMetricsInferencePerSecondPerRegion"] = UNSET
    query_per_second_global: Union[Unset, float] = UNSET
    query_per_second_per_code_global: Union[Unset, "QPS"] = UNSET
    query_per_second_per_region: Union[Unset, "QPS"] = UNSET
    query_per_second_per_region_per_code: Union[Unset, "ResourceDeploymentMetricsQueryPerSecondPerRegionPerCode"] = (
        UNSET
    )
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        inference_per_second_global: Union[Unset, list[dict[str, Any]]] = UNSET
        if not isinstance(self.inference_per_second_global, Unset):
            inference_per_second_global = []
            for componentsschemas_array_metric_item_data in self.inference_per_second_global:
                componentsschemas_array_metric_item = componentsschemas_array_metric_item_data.to_dict()
                inference_per_second_global.append(componentsschemas_array_metric_item)

        inference_per_second_per_region: Union[Unset, dict[str, Any]] = UNSET
        if not isinstance(self.inference_per_second_per_region, Unset):
            inference_per_second_per_region = self.inference_per_second_per_region.to_dict()

        query_per_second_global = self.query_per_second_global

        query_per_second_per_code_global: Union[Unset, dict[str, Any]] = UNSET
        if not isinstance(self.query_per_second_per_code_global, Unset):
            query_per_second_per_code_global = self.query_per_second_per_code_global.to_dict()

        query_per_second_per_region: Union[Unset, dict[str, Any]] = UNSET
        if not isinstance(self.query_per_second_per_region, Unset):
            query_per_second_per_region = self.query_per_second_per_region.to_dict()

        query_per_second_per_region_per_code: Union[Unset, dict[str, Any]] = UNSET
        if not isinstance(self.query_per_second_per_region_per_code, Unset):
            query_per_second_per_region_per_code = self.query_per_second_per_region_per_code.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if inference_per_second_global is not UNSET:
            field_dict["inference_per_second_global"] = inference_per_second_global
        if inference_per_second_per_region is not UNSET:
            field_dict["inference_per_second_per_region"] = inference_per_second_per_region
        if query_per_second_global is not UNSET:
            field_dict["query_per_second_global"] = query_per_second_global
        if query_per_second_per_code_global is not UNSET:
            field_dict["query_per_second_per_code_global"] = query_per_second_per_code_global
        if query_per_second_per_region is not UNSET:
            field_dict["query_per_second_per_region"] = query_per_second_per_region
        if query_per_second_per_region_per_code is not UNSET:
            field_dict["query_per_second_per_region_per_code"] = query_per_second_per_region_per_code

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: dict[str, Any]) -> T:
        from ..models.metric import Metric
        from ..models.qps import QPS
        from ..models.resource_deployment_metrics_inference_per_second_per_region import (
            ResourceDeploymentMetricsInferencePerSecondPerRegion,
        )
        from ..models.resource_deployment_metrics_query_per_second_per_region_per_code import (
            ResourceDeploymentMetricsQueryPerSecondPerRegionPerCode,
        )

        if not src_dict:
            return None
        d = src_dict.copy()
        inference_per_second_global = []
        _inference_per_second_global = d.pop("inference_per_second_global", UNSET)
        for componentsschemas_array_metric_item_data in _inference_per_second_global or []:
            componentsschemas_array_metric_item = Metric.from_dict(componentsschemas_array_metric_item_data)

            inference_per_second_global.append(componentsschemas_array_metric_item)

        _inference_per_second_per_region = d.pop("inference_per_second_per_region", UNSET)
        inference_per_second_per_region: Union[Unset, ResourceDeploymentMetricsInferencePerSecondPerRegion]
        if isinstance(_inference_per_second_per_region, Unset):
            inference_per_second_per_region = UNSET
        else:
            inference_per_second_per_region = ResourceDeploymentMetricsInferencePerSecondPerRegion.from_dict(
                _inference_per_second_per_region
            )

        query_per_second_global = d.pop("query_per_second_global", UNSET)

        _query_per_second_per_code_global = d.pop("query_per_second_per_code_global", UNSET)
        query_per_second_per_code_global: Union[Unset, QPS]
        if isinstance(_query_per_second_per_code_global, Unset):
            query_per_second_per_code_global = UNSET
        else:
            query_per_second_per_code_global = QPS.from_dict(_query_per_second_per_code_global)

        _query_per_second_per_region = d.pop("query_per_second_per_region", UNSET)
        query_per_second_per_region: Union[Unset, QPS]
        if isinstance(_query_per_second_per_region, Unset):
            query_per_second_per_region = UNSET
        else:
            query_per_second_per_region = QPS.from_dict(_query_per_second_per_region)

        _query_per_second_per_region_per_code = d.pop("query_per_second_per_region_per_code", UNSET)
        query_per_second_per_region_per_code: Union[Unset, ResourceDeploymentMetricsQueryPerSecondPerRegionPerCode]
        if isinstance(_query_per_second_per_region_per_code, Unset):
            query_per_second_per_region_per_code = UNSET
        else:
            query_per_second_per_region_per_code = ResourceDeploymentMetricsQueryPerSecondPerRegionPerCode.from_dict(
                _query_per_second_per_region_per_code
            )

        resource_deployment_metrics = cls(
            inference_per_second_global=inference_per_second_global,
            inference_per_second_per_region=inference_per_second_per_region,
            query_per_second_global=query_per_second_global,
            query_per_second_per_code_global=query_per_second_per_code_global,
            query_per_second_per_region=query_per_second_per_region,
            query_per_second_per_region_per_code=query_per_second_per_region_per_code,
        )

        resource_deployment_metrics.additional_properties = d
        return resource_deployment_metrics

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
