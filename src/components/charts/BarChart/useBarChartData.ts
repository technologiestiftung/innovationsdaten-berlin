/* eslint-disable no-nested-ternary */

import { useMemo } from "react";
import branchen from "@/data/branchen.json";
import colors from "@/data/colors.json";
import wordings from "@/data/wordings.json";
import { sumNumericValues } from "@/utilities";
import { BranchenItem, ChapterItem, Region } from "@/types/global";

type UseBarChartDataArgs = {
	chartData: ChapterItem["chartData"];
	chart_type?: string;
	id?: string;
	sortBy: string | null;
	activeFilter: string | null;
	max_value?: number | Partial<Record<Region, number>>;
	sortsAfter?: string[];
	sortsAfterOnStart?: string;
	region: Region;
};

export function useBarChartData({
	chartData,
	chart_type,
	id,
	sortBy,
	activeFilter,
	max_value,
	sortsAfter,
	sortsAfterOnStart,
	region,
}: UseBarChartDataArgs) {
	return useMemo(() => {
		const hasRegionToggle =
			!!chartData &&
			typeof chartData === "object" &&
			!Array.isArray(chartData) &&
			"ber" in chartData;

		const selectedChartData = hasRegionToggle
			? (chartData as Partial<Record<Region, ChapterItem["chartData"]>>)[region]
			: chartData;

		const selectedMaxValue =
			max_value && typeof max_value !== "number"
				? max_value[region]
				: max_value;

		const getBreakPoint = Math.floor((selectedMaxValue ?? 0) * 0.6666666);

		if (!selectedChartData || !chart_type) {
			return {
				collectData: [],
				objectKeys: [],
				hasRegionToggle,
				selectedMaxValue,
			};
		}

		let result = [];

		if (!chart_type.includes("filter_keys")) {
			result = branchen.map((branche: BranchenItem) => {
				if (
					chart_type.includes("stacked") &&
					Array.isArray(selectedChartData)
				) {
					const getData = selectedChartData.find(
						(item: ChapterItem) => item.id === branche.id,
					);

					if (id === "most_supported_branchen") {
						return {
							...branche,
							...getData,
							total: sumNumericValues(getData),
						};
					}

					if (getData && "insgesamt" in getData) {
						return {
							...branche,
							...getData,
						};
					}

					return {
						...branche,
						...getData,
						insgesamt: sumNumericValues(getData),
					};
				}

				const dataByBranche = selectedChartData as Record<
					string,
					number | { value: number; delta: number }
				>;

				const rawValue = dataByBranche[branche.id];

				const getDelta =
					chart_type === "bar_chart"
						? 0
						: typeof rawValue === "object"
							? rawValue.delta
							: 0;

				const getValue =
					chart_type === "bar_chart"
						? Number(rawValue)
						: typeof rawValue === "object"
							? rawValue.value
							: 0;

				return {
					id: branche.id,
					name: branche.name,
					value: getValue,
					delta: Math.abs(getDelta),
					positiveDelta: getDelta > 0,
					isSmall: getValue < getBreakPoint,
					color: branche.color,
				};
			});
		} else if (Array.isArray(selectedChartData)) {
			result = selectedChartData.map((item) => {
				const getID = item.id;
				const getValue = item[activeFilter || "insgesamt"];

				let getName = wordings[getID as keyof typeof wordings];

				const findBranche = branchen.find(
					(singleBranche) => singleBranche.id === getID,
				);

				if (!getName && findBranche) {
					getName = findBranche.name;
				}

				if (getName.includes("<br/>")) {
					getName = getName.replace(/<br\/>/g, " ");
				}

				return {
					name: getName,
					isSmall: Number(getValue) < getBreakPoint,
					color: findBranche?.color || colors.blue,
					...item,
				};
			});
		}

		let getSortBy: string | null | undefined = null;

		if (sortBy) {
			getSortBy = sortBy;
		} else if (
			result.some((item) => "insgesamt" in item) &&
			!result.some((item) => "total" in item)
		) {
			getSortBy = "insgesamt";
		} else if (Array.isArray(sortsAfter)) {
			getSortBy = sortsAfter[0];
		}

		if (!getSortBy && sortsAfterOnStart) {
			getSortBy = sortsAfterOnStart;
		}

		const sortKey = getSortBy || "value";

		const collectData = [...result].sort((a, b) => {
			if (a[sortKey] < b[sortKey]) {
				return 1;
			}
			if (a[sortKey] > b[sortKey]) {
				return -1;
			}
			return 0;
		});

		const excludeKeyFromBranch = [
			"color",
			"id",
			"name",
			"sektor",
			"sektor_id",
			"umsatz_produkt_neuheiten",
		];

		const objectKeys =
			collectData.length > 0
				? Object.keys(collectData[0]).filter(
						(dataKey) =>
							!excludeKeyFromBranch.includes(dataKey) &&
							!dataKey.includes("display"),
					)
				: [];

		return {
			collectData,
			objectKeys,
			hasRegionToggle,
			selectedMaxValue,
		};
	}, [
		chartData,
		chart_type,
		id,
		sortBy,
		activeFilter,
		max_value,
		sortsAfter,
		sortsAfterOnStart,
		region,
	]);
}
