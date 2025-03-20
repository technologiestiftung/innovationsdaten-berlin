import React, { useEffect, useRef, useState } from "react";
import {
	XAxis,
	YAxis,
	Tooltip,
	AreaChart as AreaChartRecharts,
	Area,
} from "recharts";
import sektoren from "../data/sektoren.json";
import branchen from "../data/branchen.json";
import areacharts from "../data/areacharts-testing.json";
import colors from "../data/colors.json";
import { hexToRgba } from "../utilities";
import FilterDropdown from "../components/FilterDropDown";
import { useGlobalContext } from "../GlobalContext";
import Icon from "../components/Icons";

const AreaChart: React.FC = () => {
	const { theme, fontSize, isMobile, breakPoint } = useGlobalContext();
	const axisFontStylings = {
		style: {
			fontFamily: "Clan Pro, sans-serif",
			fontSize: fontSize,
			fontWeight: "bold",
		},
	};
	const defaultWidthOfAreaChart = window.innerWidth - 2 * fontSize;
	const heightOfAreaCharts = isMobile
		? defaultWidthOfAreaChart
		: window.innerHeight * 0.5;
	const marginRightOfAreaChart = 25;

	const CustomTooltip = ({ active, payload, activeFilters }: any) => {
		if (!active || !payload || !payload.length) {
			return null;
		}
		const data = payload[0].payload;
		const findTitle = (dataKey: any) => {
			if (dataKey === "dienstleistungen") {
				return "Dienstleistungen";
			}
			if (dataKey === "industrie") {
				return "Industrie";
			}
			const sektor = sektoren.find((findSektor) => findSektor.id === dataKey);
			return sektor?.name || dataKey.toUpperCase();
		};
		return (
			<div
				className="p-4"
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
					{data?.year}
				</p>
				{Object.keys(data).map((dataKey) => (
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
										{data[dataKey]} Mrd. €
									</p>
								</div>
							)}
					</div>
				))}
			</div>
		);
	};

	const SingleAreaChart = ({ areachart }: any) => {
		const barChartRef = useRef<HTMLDivElement | null>(null);
		const xAxisRef = useRef<XAxis | null>(null);
		const areaChartID = `area-chart-${areachart.id}`;
		const [actualGraphWidth, setActualGraphWidth] = useState<{
			width: number;
			difference: number;
		} | null>(null);

		const getStrokeOrFill = (id: string, color: string | null) => {
			if (theme === "dark") {
				if (activeFilters.indexOf(id) > -1) {
					if (color) {
						return color;
					}
					return colors.white;
				}
				return hexToRgba(colors.white, 0.2);
			}
			if (activeFilters.indexOf(id) > -1) {
				if (color) {
					return color;
				}
				return colors.blue;
			}
			return hexToRgba(colors.blue, 0.2);
		};

		const allFilters =
			areachart.id !== "branchen"
				? sektoren
						.map((sektor) => {
							if (sektor.branche_id === areachart.id) {
								return sektor.id;
							}
							return undefined;
						})
						.filter((filter): filter is string => filter !== undefined)
				: [];

		const [activeFilters, setActiveFilters] = useState<string[]>(allFilters);

		const measureXAxis = () => {
			const xAxisElement = document.querySelector(`#${areaChartID} .xAxis`);
			if (xAxisElement) {
				const actualWidth = xAxisElement.getBoundingClientRect()?.width;
				const barChartWidth =
					barChartRef?.current?.getBoundingClientRect()?.width;
				if (actualWidth && barChartWidth) {
					const difference = barChartWidth - actualWidth;
					const setState = {
						width: barChartWidth + difference - marginRightOfAreaChart,
						difference: difference - marginRightOfAreaChart,
					};
					setActualGraphWidth(setState);
				}
			}
		};

		useEffect(() => {
			measureXAxis();
			// window.addEventListener("resize", measureXAxis);
			// return () => window.removeEventListener("resize", measureXAxis);
		}, []);

		return (
			<>
				{areachart.id !== "branchen" && (
					<div
						className={`flex items-center mb-4 ${isMobile ? "justify-between" : "justify-center gap-16"}`}
					>
						<div className="flex items-center gap-2">
							<Icon id="filter" size={fontSize} />
							<p className="bold">Filter</p>
						</div>
						<FilterDropdown
							allFilters={allFilters}
							activeFilters={activeFilters}
							setFilters={setActiveFilters}
						/>
					</div>
				)}
				<div
					ref={barChartRef}
					id={areaChartID}
					style={{
						transform:
							isMobile && !!actualGraphWidth
								? `translateX(-${actualGraphWidth?.difference}px)`
								: "none",
					}}
				>
					<AreaChartRecharts
						width={
							isMobile
								? actualGraphWidth?.width || defaultWidthOfAreaChart
								: breakPoint * 0.9
						}
						height={heightOfAreaCharts}
						data={areachart.data}
						margin={{ right: marginRightOfAreaChart }}
					>
						<XAxis
							dataKey="year"
							stroke={theme === "dark" ? colors.white : colors.blue}
							strokeWidth={2}
							ref={xAxisRef}
							tick={axisFontStylings}
						/>
						<YAxis
							stroke={theme === "dark" ? colors.white : colors.blue}
							strokeWidth={2}
							tick={axisFontStylings}
						/>
						<Tooltip
							content={(props) => (
								<CustomTooltip {...props} activeFilters={activeFilters} />
							)}
						/>
						{areachart.id === "branchen" ? (
							<>
								{branchen.map((branche) => (
									<Area
										key={branche.id}
										type="linear"
										dataKey={branche.id}
										stroke={theme === "dark" ? colors.white : colors.blue}
										strokeWidth={3}
										fill={branche.color}
										stackId="1"
									/>
								))}
							</>
						) : (
							<>
								{sektoren
									.filter((sektor) => sektor.branche_id === areachart.id)
									.map((sektor) => (
										<Area
											key={sektor.id}
											type="linear"
											dataKey={sektor.id}
											stroke={getStrokeOrFill(sektor.id, null)}
											strokeWidth={3}
											fill={getStrokeOrFill(sektor.id, sektor.color)}
											stackId="1"
										/>
									))}
							</>
						)}
					</AreaChartRecharts>
				</div>
			</>
		);
	};

	return (
		<section id="areachart" className="py-14">
			{areacharts.map((areachart, index) => (
				<div key={areachart.id} className={!index ? "" : "mt-14"}>
					<h2 className="mb-4">{areachart.title}</h2>
					<p className="mb-14">{areachart.text}</p>
					<SingleAreaChart areachart={areachart} />
				</div>
			))}
		</section>
	);
};

export default AreaChart;
