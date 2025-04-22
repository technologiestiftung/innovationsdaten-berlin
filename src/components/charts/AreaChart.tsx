import React, { useState } from "react";
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
import sektoren from "../../data/sektoren.json";
import colors from "../../data/colors.json";
import {
	formatEuroNumber,
	formatNumber,
	hexToRgba,
	roundToTwoDecimals,
} from "../../utilities";
import Dropdown from "../DropDown";
import { useGlobalContext } from "../../GlobalContext";
import { Region, StickyItemData } from "../../types/global";
import DataToggle from "../DataToggle";

type AreaChartProps = {
	id: string;
	data: StickyItemData;
	toggleData?: string;
	setToggleData?: (toggleData: string) => void;
	togglesBetween?: string[];
};

const AreaChart: React.FC<AreaChartProps> = ({
	id,
	data,
	toggleData,
	setToggleData,
	togglesBetween,
}) => {
	const { theme, region, setRegion } = useGlobalContext();

	const allFilters = branchen.map((branche) => branche.id);
	const [activeFilters, setActiveFilters] = useState<string[] | null>(
		allFilters,
	);

	const setData = data as StickyItemData[];

	const getStrokeOrFill = (brancheID: string, color: string | null) => {
		if (activeFilters) {
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
					}}
				>
					{payloadData?.year}
				</p>
				{id !== "berlin_is_ahead" && (
					<>
						{Object.keys(payloadData).map((dataKey) => (
							<div key={dataKey}>
								{dataKey !== "year" &&
									(activeFilters?.includes(dataKey) ||
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
												{/* Value Display */}
												{formatEuroNumber(payloadData[dataKey])}
											</p>
										</div>
									)}
							</div>
						))}
					</>
				)}
				{id === "berlin_is_ahead" && (
					<>
						{Object.keys(payloadData).map((dataKey) => (
							<div key={dataKey}>
								{dataKey !== "year" && (
									<>
										<div className="flex justify-between gap-6">
											<p
												className="max-w-[100px] truncate"
												style={{
													color: theme === "dark" ? colors.dark : colors.white,
												}}
											>
												{dataKey === "ber" ? "Berlin" : "Deutschland"}:
											</p>
											<p
												className="bold ml-2"
												style={{
													color: theme === "dark" ? colors.dark : colors.white,
												}}
											>
												{roundToTwoDecimals(payloadData[dataKey])}%
											</p>
										</div>
									</>
								)}
							</div>
						))}
					</>
				)}
			</div>
		);
	};

	return (
		<>
			<ResponsiveContainer width="100%" height={window.innerHeight * 0.5}>
				<AreaChartRecharts data={setData}>
					<XAxis
						dataKey="year"
						stroke={theme === "dark" ? colors.white : colors.blue}
						strokeWidth={2}
						interval={0}
					/>
					<Tooltip content={<CustomTooltip />} />
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
									/>
								))}
						</>
					)}
					{id === "berlin_is_ahead" && (
						<>
							<Area
								type="linear"
								dataKey="ber"
								fill="none"
								stroke={colors.cyan_light}
								strokeWidth={3}
							/>
							<Area
								type="linear"
								dataKey="de"
								fill="none"
								stroke={colors.green_light}
								strokeWidth={3}
							/>
						</>
					)}
					<CartesianGrid
						strokeDasharray="3 3"
						vertical={false}
						stroke={theme === "dark" ? colors.white : colors.blue}
					/>
					<YAxis
						mirror
						stroke="none"
						tick={{
							fill: theme === "dark" ? colors.white : colors.blue,
						}}
						// Value Display
						tickFormatter={(label: string) => {
							return id === "berlin_is_ahead"
								? `${formatNumber(+label)}%`
								: formatEuroNumber(+label);
						}}
					/>
				</AreaChartRecharts>
			</ResponsiveContainer>
			<div className="mt-8 flex gap-8 items-center justify-end">
				{id !== "berlin_is_ahead" && (
					<DataToggle
						data={region}
						setData={(value: string) => setRegion(value as Region)}
						allDatas={["ber", "de"]}
					/>
				)}
				{id === "growth" && (
					<Dropdown
						type="filter"
						allFilters={allFilters}
						activeFilters={activeFilters}
						setFilters={setActiveFilters}
					/>
				)}
				{id === "berlin_is_ahead" &&
					toggleData &&
					setToggleData &&
					togglesBetween && (
						<DataToggle
							data={toggleData}
							setData={(value: string) => setToggleData(value)}
							allDatas={togglesBetween}
						/>
					)}
			</div>
		</>
	);
};

export default AreaChart;
