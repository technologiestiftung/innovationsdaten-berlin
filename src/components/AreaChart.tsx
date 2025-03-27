import React, { useState } from "react";
import {
	XAxis,
	Tooltip,
	AreaChart as AreaChartRecharts,
	Area,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import branchen from "../data/branchen.json";
import sektoren from "../data/sektoren.json";
import colors from "../data/colors.json";
import { hexToRgba } from "../utilities";
import FilterDropdown from "../components/FilterDropDown";
import { useGlobalContext } from "../GlobalContext";
import { StickyItemData } from "../types/global";

type AreaChartProps = {
	id: string;
	data: StickyItemData;
};

const AreaChart: React.FC<AreaChartProps> = ({ id, data }) => {
	const { theme, fontSize } = useGlobalContext();

	const axisFontStylings = {
		style: {
			fontFamily: "Clan Pro, sans-serif",
			fontSize: fontSize,
			fontWeight: "bold",
		},
	};

	const allFilters = branchen.map((branche) => branche.id);
	const [activeFilters, setActiveFilters] = useState<string[]>(allFilters);

	const setData = data as StickyItemData[];

	const getStrokeOrFill = (brancheID: string, color: string | null) => {
		if (theme === "dark") {
			if (activeFilters.indexOf(brancheID) > -1) {
				if (color) {
					return color;
				}
				return colors.white;
			}
			return hexToRgba(colors.white, 0.2);
		}
		if (activeFilters.indexOf(brancheID) > -1) {
			if (color) {
				return color;
			}
			return colors.blue;
		}
		return hexToRgba(colors.blue, 0.2);
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
		return (
			<div
				className="p-4 select-none"
				style={{
					backgroundColor: theme === "dark" ? colors.white : colors.blue,
				}}
			>
				<p
					className="bold"
					style={{
						color: theme === "dark" ? colors.dark : colors.white,
						marginBottom: fontSize,
					}}
				>
					{payloadData?.year}
				</p>
				{Object.keys(payloadData).map((dataKey) => (
					<div key={dataKey}>
						{dataKey !== "year" &&
							(activeFilters.includes(dataKey) ||
								dataKey === "dienstleistungen" ||
								dataKey === "industrie") && (
								<div className="flex justify-between gap-6">
									<p
										className="max-w-[100px] truncate"
										style={{
											color: theme === "dark" ? colors.dark : colors.white,
										}}
									>
										{findTitle(dataKey)}:
									</p>
									<p
										className="bold ml-2"
										style={{
											color: theme === "dark" ? colors.dark : colors.white,
										}}
									>
										{payloadData[dataKey]} Mrd. €
									</p>
								</div>
							)}
					</div>
				))}
			</div>
		);
	};

	return (
		<>
			{id === "growth" && (
				<div className="flex w-full justify-end mb-4">
					<FilterDropdown
						allFilters={allFilters}
						activeFilters={activeFilters}
						setFilters={setActiveFilters}
					/>
				</div>
			)}
			<ResponsiveContainer width="100%" height={window.innerHeight * 0.5}>
				<AreaChartRecharts data={setData}>
					<XAxis
						dataKey="year"
						stroke={theme === "dark" ? colors.white : colors.blue}
						strokeWidth={2}
						tick={axisFontStylings}
					/>
					<Tooltip content={<CustomTooltip />} />
					<CartesianGrid strokeDasharray="3 3" vertical={false} />
					{id === "sektoren" ? (
						<>
							{sektoren.map((sektor) => (
								<Area
									key={sektor.id}
									type="linear"
									dataKey={sektor.id}
									stroke={theme === "dark" ? colors.white : colors.blue}
									strokeWidth={3}
									fill={sektor.color}
									stackId="1"
									fillOpacity={1}
								/>
							))}
						</>
					) : (
						<>
							{branchen
								.filter((branche) => activeFilters.indexOf(branche.id) > -1)
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
									/>
								))}
						</>
					)}
				</AreaChartRecharts>
			</ResponsiveContainer>
		</>
	);
};

export default AreaChart;
