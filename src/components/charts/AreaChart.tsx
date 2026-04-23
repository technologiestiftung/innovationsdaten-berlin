/* eslint-disable complexity */
/* eslint-disable no-nested-ternary */

import React, { useRef, useState } from "react";
import {
	XAxis,
	Tooltip,
	AreaChart as AreaChartRecharts,
	Area,
	ResponsiveContainer,
	CartesianGrid,
	YAxis,
} from "recharts";
import branchen from "../../data/branchen.json";
import wordings from "../../data/wordings.json";
import sektoren from "../../data/sektoren.json";
import colors from "../../data/colors.json";
import {
	cn,
	formatEuroNumber,
	formatNumber,
	roundToTwoDecimals,
} from "../../utilities";
import Dropdown from "../DropDown";
import { useGlobalContext } from "../../GlobalContext";
import { Region, StickyItemData } from "../../types/global";
import DataToggle from "../DataToggle";

type AreaChartProps = {
	chart_type: string;
	data: StickyItemData;
	toggleData?: string;
	setToggleData?: (toggleData: string) => void;
	togglesBetween?: string[];
	max_value?: number;
	hide_toggle?: boolean;
};

const AreaChart: React.FC<AreaChartProps> = ({
	chart_type,
	data,
	toggleData,
	setToggleData,
	togglesBetween,
	max_value,
	hide_toggle,
}) => {
	const {
		axisFontStylings,
		region,
		setRegion,
		animationDuration,
		windowMeasuresOnStart,
	} = useGlobalContext();

	const optionsRef = useRef<HTMLDivElement>(null);
	const allFilters = branchen.map((branche) => branche.id);
	const [activeFilters, setActiveFilters] = useState<string[] | null>(
		allFilters,
	);

	const setData = data as StickyItemData[];
	const getStrokeOrFill = (brancheID: string, color: string | null) => {
		if (activeFilters && activeFilters.indexOf(brancheID) > -1) {
			if (color) {
				return color;
			}
			return "var(--foreground)";
		}
		return "color-mix(in srgb, var(--foreground) 20%, transparent)";
	};
	const CustomTooltip = ({ active, payload }: any) => {
		if (!active || !payload || !payload.length) {
			return null;
		}
		const payloadData = payload[0].payload;
		const findTitle = (dataKey: any) => {
			if (dataKey === "dienstleistungen") {
				return "Dienstleistungen";
			}
			if (dataKey === "industrie") {
				return "Industrie";
			}
			const branche = branchen.find(
				(findBranche) => findBranche.id === dataKey,
			);
			return branche?.name || dataKey.toUpperCase();
		};
		const getBGColor = (dataKey: any) => {
			if (sektoren.some((someSektor) => someSektor.id === dataKey)) {
				const getSektor = sektoren.find(
					(findSektor) => findSektor.id === dataKey,
				);
				return getSektor?.color;
			}
			if (branchen.some((branche) => branche.id === dataKey)) {
				const findBranche = branchen.find((branche) => branche.id === dataKey);
				return findBranche?.color;
			}
			if (dataKey === "ber" || dataKey === "de") {
				return dataKey === "ber" ? colors.cyan_light : colors.green_light;
			}
			return colors.blue;
		};
		return (
			<div className="p-4 select-none bg-foreground">
				<p className="font-bold mb-4 text-background">{payloadData?.year}</p>
				{!chart_type?.includes("toggle") ? (
					<>
						{Object.keys(payloadData)
							.filter((dataKey) => dataKey !== "year")
							.map((dataKey) => (
								<div key={dataKey}>
									{(activeFilters?.includes(dataKey) ||
										dataKey === "dienstleistungen" ||
										dataKey === "industrie") && (
										<div className="flex justify-between gap-6">
											<div className="flex items-center">
												<span
													style={{
														display: "inline-block",
														width: 12,
														height: 12,
														backgroundColor: getBGColor(dataKey),
														marginRight: 8,
													}}
												/>
												<p className="max-w-[40vw] truncate text-background">
													{findTitle(dataKey)}:
												</p>
											</div>
											<p className="font-bold ml-2 text-background">
												{formatEuroNumber(payloadData[dataKey])}
											</p>
										</div>
									)}
								</div>
							))}
					</>
				) : (
					<>
						{Object.keys(payloadData)
							.filter((dataKey) => dataKey !== "year")
							.map((dataKey) => (
								<div key={dataKey}>
									<div className="flex justify-between gap-6">
										<div className="flex items-center">
											<span
												style={{
													display: "inline-block",
													width: 12,
													height: 12,
													backgroundColor: getBGColor(dataKey),
													marginRight: 8,
												}}
											/>
											<p className="text-background">
												{dataKey === "ber" ? "Berlin" : "Deutschland"}:
											</p>
										</div>
										<p className="font-bold ml-2 text-background">
											{roundToTwoDecimals(payloadData[dataKey])}
											{wordings.percentage_sign}
										</p>
									</div>
								</div>
							))}
					</>
				)}
			</div>
		);
	};

	const getNumberOfOptions = () => {
		const isBranchen = chart_type?.includes("branchen");
		const hasToggle = chart_type?.includes("toggle");

		if (!hasToggle && isBranchen) {
			return 2;
		}
		if (!hide_toggle) {
			return 1;
		}
		return 0;
	};
	const numberOfOptionsShown = getNumberOfOptions();

	return (
		<div className="area-chart">
			<div
				className={cn(
					!numberOfOptionsShown
						? "h-[calc(var(--window-height-on-start)-var(--header-height))]"
						: numberOfOptionsShown === 1
							? "h-[calc(var(--window-height-on-start)-var(--header-height)-44px-0.5rem)]"
							: "h-[calc(var(--window-height-on-start)-var(--header-height)-88px-1rem)]",
					"lg:h-[50vh]",
				)}
				style={
					{
						"--window-height-on-start": `${(windowMeasuresOnStart?.h ?? 0) * 0.95}px`,
					} as React.CSSProperties
				}
			>
				<ResponsiveContainer width="100%" height="100%">
					<AreaChartRecharts data={setData}>
						<XAxis
							dataKey="year"
							strokeWidth={2}
							tick={axisFontStylings}
							interval={0}
							stroke="var(--foreground)"
						/>
						<Tooltip content={<CustomTooltip />} />
						{chart_type?.includes("sektoren") && (
							<>
								{sektoren.map((sektor) => (
									<Area
										key={sektor.id}
										type="linear"
										dataKey={sektor.id}
										stroke="var(--foreground)"
										strokeWidth={3}
										fill={sektor.color}
										stackId="1"
										fillOpacity={1}
										animationDuration={animationDuration}
									/>
								))}
							</>
						)}
						{chart_type?.includes("branchen") && (
							<>
								{branchen
									.filter((branche) =>
										activeFilters
											? activeFilters?.indexOf(branche.id) > -1
											: false,
									)
									.map((branche) => (
										<Area
											key={branche.id}
											type="linear"
											dataKey={branche.id}
											stroke={getStrokeOrFill(branche.id, null)}
											strokeWidth={3}
											fill={getStrokeOrFill(branche.id, branche.color)}
											stackId="1"
											fillOpacity={1}
											animationDuration={animationDuration}
										/>
									))}
							</>
						)}
						{chart_type?.includes("toggle") && (
							<>
								<Area
									type="linear"
									dataKey="ber"
									fill="none"
									stroke={colors.cyan_light}
									strokeWidth={3}
									animationDuration={animationDuration}
								/>
								<Area
									type="linear"
									dataKey="de"
									fill="none"
									stroke={colors.green_light}
									strokeWidth={3}
									animationDuration={animationDuration}
								/>
							</>
						)}
						<YAxis
							mirror
							stroke="none"
							width="auto"
							domain={max_value ? [0, max_value] : ["auto", "auto"]}
							tick={{
								...axisFontStylings,
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
			</div>
			{!hide_toggle && (
				<div
					className="flex max-xl:flex-col max-xl:items-end max-xl:gap-2 mt-2 md:mt-6 xl:mt-8 xl:items-center xl:gap-8 xl:justify-end"
					ref={optionsRef}
				>
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
								setData={(value: string) => setToggleData(value)}
								allDatas={togglesBetween}
								togglesBetween
							/>
						)}
				</div>
			)}
		</div>
	);
};

export default AreaChart;
