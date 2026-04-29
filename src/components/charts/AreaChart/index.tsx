import React, { useEffect, useState } from "react";
import {
	XAxis,
	AreaChart as AreaChartRecharts,
	ResponsiveContainer,
	CartesianGrid,
	YAxis,
} from "recharts";
import branchen from "@/data/branchen.json";
import wordings from "@/data/wordings.json";
import { formatEuroNumber, formatNumber } from "@/utilities";
import Dropdown from "@/components/DropDown";
import { useGlobalContext } from "@/GlobalContext";
import {
	Region,
	DataKeys,
	ChapterItem,
	AreaChartDataType,
} from "@/types/global";
import DataToggle from "@/components/DataToggle";
import ToolTip from "./components/ToolTip";
import BranchenArea from "./components/BranchenArea";
import ToggleArea from "./components/ToggleArea";
import SektorenArea from "./components/SektorenArea";
import AreaChartWrapper from "./components/AreaChartWrapper";

const AreaChart: React.FC<ChapterItem> = ({
	chart_type,
	chartData,
	max_value,
	hide_toggle,
	togglesBetween,
}) => {
	const { region, setRegion, windowMeasuresOnStart } = useGlobalContext();

	const allFilters = branchen.map((branche) => branche.id);

	const [toggleData, setToggleData] = useState<DataKeys | null>(null);
	const [activeFilters, setActiveFilters] = useState<string[] | null>(
		allFilters,
	);

	useEffect(() => {
		if (togglesBetween) {
			setToggleData(togglesBetween[0] as DataKeys);
		}
	}, [togglesBetween]);

	if (!chart_type || !chartData) {
		return null;
	}

	return (
		<div className="area-chart hide-first-y-axis-tick move-last-x-axis-tick move-first-x-axis-tick move-entire-y-axis-ticks">
			<AreaChartWrapper
				chart_type={chart_type}
				hide_toggle={hide_toggle}
				windowMeasuresOnStart={windowMeasuresOnStart}
			>
				<ResponsiveContainer width="100%" height="100%">
					<AreaChartRecharts
						data={
							chartData[
								(toggleData ?? region) as keyof typeof chartData
							] as AreaChartDataType[]
						}
					>
						<XAxis
							dataKey="year"
							strokeWidth={2}
							tick={{
								fontFamily: "Clan Pro, sans-serif",
								fontSize: 16,
								fontWeight: "bold",
							}}
							interval={0}
							stroke="var(--foreground)"
						/>
						<ToolTip chart_type={chart_type} activeFilters={activeFilters} />
						<SektorenArea chart_type={chart_type} />
						<BranchenArea
							chart_type={chart_type}
							activeFilters={activeFilters}
						/>
						<ToggleArea chart_type={chart_type} />
						<YAxis
							mirror
							stroke="none"
							width="auto"
							domain={
								max_value
									? ([0, max_value] as [number, number])
									: ["auto", "auto"]
							}
							tick={{
								fontFamily: "Clan Pro, sans-serif",
								fontSize: 16,
								fontWeight: "bold",
								fill: "var(--foreground)",
							}}
							tickFormatter={(label: string) => {
								return chart_type?.includes("toggle")
									? `${formatNumber(+label)}${wordings.percentage_sign}`
									: formatEuroNumber(+label);
							}}
						/>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="var(--foreground)"
							zIndex={10000}
						/>
					</AreaChartRecharts>
				</ResponsiveContainer>
			</AreaChartWrapper>
			{!hide_toggle && (
				<div className="flex max-xl:flex-col max-xl:items-end max-xl:gap-2 mt-2 md:mt-4 xl:items-center xl:gap-8 xl:justify-end">
					{!chart_type?.includes("toggle") && (
						<DataToggle
							data={region}
							setData={(value: string) => setRegion(value as Region)}
							allDatas={["ber", "de"]}
						/>
					)}
					{chart_type?.includes("branchen") && (
						<Dropdown
							type="filter"
							allFilters={allFilters}
							activeFilters={activeFilters}
							setFilters={setActiveFilters}
						/>
					)}
					{chart_type?.includes("toggle") &&
						toggleData &&
						setToggleData &&
						togglesBetween && (
							<DataToggle
								data={toggleData}
								setData={(value: DataKeys) => setToggleData(value as DataKeys)}
								allDatas={togglesBetween as DataKeys[]}
								togglesBetween
							/>
						)}
				</div>
			)}
		</div>
	);
};

export default AreaChart;
