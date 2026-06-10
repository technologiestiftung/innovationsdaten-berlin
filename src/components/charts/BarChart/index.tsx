import React, { useEffect, useState } from "react";
import { ChapterItem, Region } from "@/types/global";
import {
	BarChart as RechartsBarChart,
	XAxis,
	YAxis,
	ResponsiveContainer,
	CartesianGrid,
	Tooltip as RechartsToolTip,
} from "recharts";
import { useGlobalContext } from "@/GlobalContext";
import colors from "@/data/colors.json";
import { cn, formatEuroNumber } from "@/utilities";
import Dropdown from "@/components/DropDown";
import DataToggle from "@/components/DataToggle";
import { getBarCategoryGap } from "./utils";
import ToolTip from "./components/ToolTip";
import Legend from "./components/Legend";
import RegularBar from "./components/RegularBar";
import DeltaBar from "./components/DeltaBar";
import StackedBar from "./components/StackedBar";
import FilterKeysBar from "./components/FilterKeysBar";
import CustomLineHeightYAxisTick from "./components/CustomLineHeightYAxisTick";
import CustomMobileTick from "./components/CustomMobileTick";
import { useBarChartData } from "./useBarChartData";
import BarChartWrapper from "./components/BarChartWrapper";

const BarChart: React.FC<ChapterItem> = ({
	id,
	chartData,
	chart_type,
	chart_unit,
	has_tooltip,
	max_value,
	sortsAfter,
	sortsAfterOnStart,
}) => {
	//
	//
	// global context
	const { region, setRegion, isMobile } = useGlobalContext();

	//
	//
	// states
	const [sortBy, setSortBy] = useState<string | null>(null);
	const [allFilters, setAllFilters] = useState<string[] | null>([]);
	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const [yAxisWidth, setYAxisWidth] = useState(
		window.innerWidth * (3 / 5) - 24,
	);

	//
	//
	// set data
	const { collectData, objectKeys, hasRegionToggle, selectedMaxValue } =
		useBarChartData({
			chartData,
			chart_type,
			id,
			sortBy,
			activeFilter,
			max_value,
			sortsAfter,
			sortsAfterOnStart,
			region,
		});

	//
	//
	// consts
	const dataIsBasedOnBranchen = collectData.some(
		(findData) => findData.id === "holz",
	);

	//
	//
	// use effects
	useEffect(() => {
		setTimeout(() => {
			const axisTicksEl = document.querySelector(
				`#${id} .recharts-yAxis-tick-labels`,
			);
			if (axisTicksEl) {
				const rect = axisTicksEl.getBoundingClientRect();
				setYAxisWidth(rect.width + 6);
			}
		}, 100);
	}, [id]);
	useEffect(() => {
		if (chart_type.includes("filter_keys") && !!collectData.length) {
			const excludeKeyFromAllFilters = ["id", "name", "isSmall", "color"];
			const getAllFilters = Object.keys(collectData[0]).filter(
				(key) => !excludeKeyFromAllFilters.includes(key),
			);
			setAllFilters(getAllFilters);
			if (getAllFilters.length) {
				if (getAllFilters.includes("insgesamt")) {
					setActiveFilter("insgesamt");
				} else if (
					sortsAfterOnStart &&
					getAllFilters.includes(sortsAfterOnStart)
				) {
					setActiveFilter(sortsAfterOnStart);
				} else {
					setActiveFilter(getAllFilters[0]);
				}
			}
		}
	}, [id]);
	useEffect(() => {
		if (chart_type.includes("filter_keys")) {
			setSortBy(activeFilter);
		}
	}, [activeFilter]);
	useEffect(() => {
		if (Array.isArray(sortsAfter) && sortsAfter.length > 0) {
			setSortBy(sortsAfter[0]);
		} else {
			setSortBy(null);
		}
	}, [sortsAfter, id]);

	if (!chartData || !chart_type) {
		return null;
	}

	return (
		<>
			<BarChartWrapper
				id={id}
				chart_type={chart_type}
				collectData={collectData}
			>
				<ResponsiveContainer width="100%" height="100%">
					<RechartsBarChart
						layout="vertical"
						data={collectData}
						barCategoryGap={getBarCategoryGap(isMobile, chart_type)}
					>
						<defs>
							<pattern
								id="green-stripes"
								patternUnits="userSpaceOnUse"
								width="6"
								height="6"
							>
								<path
									d="M-2,2 L2,-2 M0,6 L6,0 M4,8 L8,4"
									stroke={colors.green}
									strokeWidth="2"
								/>
							</pattern>
							<pattern
								id="red-stripes"
								patternUnits="userSpaceOnUse"
								width="6"
								height="6"
							>
								<path
									d="M-2,2 L2,-2 M0,6 L6,0 M4,8 L8,4"
									stroke={colors.red}
									strokeWidth="2"
								/>
							</pattern>
						</defs>
						{/* YAxis */}
						<YAxis
							type="category"
							dataKey="name"
							hide={isMobile && !dataIsBasedOnBranchen}
							width={isMobile && dataIsBasedOnBranchen ? 30 : yAxisWidth}
							interval={0}
							tick={
								isMobile && dataIsBasedOnBranchen ? (
									<CustomMobileTick />
								) : (
									<CustomLineHeightYAxisTick />
								)
							}
						/>
						{/* ToolTip */}
						{has_tooltip && (
							<RechartsToolTip
								content={
									<ToolTip
										chart_unit={chart_unit}
										objectKeys={objectKeys}
										id={id}
									/>
								}
							/>
						)}
						{/* Grid */}
						<CartesianGrid strokeDasharray="3 3" horizontal={false} />
						{/* Legend */}
						<Legend chart_type={chart_type} />
						{/* Bars */}
						<RegularBar
							chart_type={chart_type}
							has_tooltip={has_tooltip}
							collectData={collectData}
							chart_unit={chart_unit}
							id={id}
						/>
						<DeltaBar
							chart_type={chart_type}
							collectData={collectData}
							chart_unit={chart_unit}
							id={id}
						/>
						<StackedBar
							chart_type={chart_type}
							objectKeys={objectKeys}
							id={id}
							has_tooltip={has_tooltip}
						/>
						<FilterKeysBar
							chart_type={chart_type}
							activeFilter={activeFilter}
							has_tooltip={has_tooltip}
							collectData={collectData}
							chart_unit={chart_unit}
							id={id}
							data={collectData}
						/>
						{/* XAxis */}
						<XAxis
							type="number"
							mirror
							stroke="none"
							domain={
								selectedMaxValue
									? ([0, selectedMaxValue] as [number, number])
									: ["auto", "auto"]
							}
							tick={{
								fontFamily: "Clan Pro, sans-serif",
								fontSize: 16,
								fontWeight: "bold",
								fill: "var(--foreground)",
								dy: 25,
							}}
							tickFormatter={(label: string) => {
								if (chart_unit === "€") {
									return formatEuroNumber(Number(label));
								}
								return `${label} ${chart_unit}`;
							}}
						/>
					</RechartsBarChart>
				</ResponsiveContainer>
			</BarChartWrapper>
			<div
				className={cn(
					"flex max-xl:flex-col max-xl:items-end max-xl:gap-2 xl:items-center xl:gap-8 xl:justify-end mt-2 md:mt-6",
					!chart_type.includes("stacked") && "max-md:mt-8 xl:mt-8",
				)}
			>
				{hasRegionToggle && (
					<DataToggle
						data={region}
						setData={(value: string) => setRegion(value as Region)}
						allDatas={["ber", "de"]}
					/>
				)}
				{sortBy && !activeFilter && (
					<Dropdown
						type="sort"
						sortsAfter={sortsAfter}
						sortBy={sortBy}
						setSortBy={setSortBy}
					/>
				)}
				{chart_type.includes("filter_keys") && allFilters && activeFilter && (
					<Dropdown
						type="filter"
						allFilters={allFilters}
						activeFilter={activeFilter}
						setActiveFilter={setActiveFilter}
						chart_type={chart_type}
					/>
				)}
			</div>
		</>
	);
};

export default BarChart;
