import React, { useEffect, useRef, useState } from "react";
import {
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	AreaChart,
	Area,
} from "recharts";
import sektoren from "../data/sektoren.json";
import branchen from "../data/branchen.json";
import colors from "../data/colors.json";
import { hexToRgba } from "../utilities";
import FilterDropdown from "../components/FilterDropDown";
import { useGlobalContext } from "../GlobalContext";
import Icon from "../components/Icons";

const BarChartSection: React.FC = () => {
	const { theme } = useGlobalContext();
	const justUseStrokeForGraph = true;
	const start = ["energie", "fahrzeugbau", "nahrung", "holz", "pharma"];
	const barChartRef = useRef<HTMLDivElement | null>(null);
	const [actualGraphWidth, setActualGraphWidth] = useState<{
		width: number;
		difference: number;
	} | null>(null);
	const [graph, setGraph] = useState<"branchen" | "sektoren" | null>(
		"sektoren",
	);
	const [activeSektoren, setActiveSektoren] = useState<string[]>([]);
	const data =
		graph === "branchen"
			? [
					{ year: 2018, dienstleistungen: 1, industrie: 2 },
					{ year: 2019, dienstleistungen: 2, industrie: 3 },
					{ year: 2020, dienstleistungen: 2, industrie: 3.5 },
					{ year: 2021, dienstleistungen: 3, industrie: 6 },
					{ year: 2022, dienstleistungen: 4, industrie: 5.5 },
					{ year: 2023, dienstleistungen: 4.5, industrie: 7 },
				]
			: graph === "sektoren"
				? [
						{
							year: 2018,
							pharma: 4,
							holz: 3,
							nahrung: 2,
							energie: 3,
							fahrzeugbau: 1,
						},
						{
							year: 2019,
							pharma: 1,
							holz: 2,
							nahrung: 1.9,
							energie: 1.5,
							fahrzeugbau: 0.8,
						},
						{
							year: 2020,
							pharma: 7,
							holz: 3,
							nahrung: 0.4,
							energie: 1.75,
							fahrzeugbau: 2,
						},
						{
							year: 2021,
							pharma: 5.3,
							holz: 4,
							nahrung: 3,
							energie: 3.7,
							fahrzeugbau: 4,
						},
						{
							year: 2022,
							pharma: 3,
							holz: 5,
							nahrung: 9,
							energie: 3.6,
							fahrzeugbau: 5,
						},
						{
							year: 2023,
							pharma: 2,
							holz: 12,
							nahrung: 7.7,
							energie: 4,
							fahrzeugbau: 7,
						},
					]
				: [
						{ year: 2018 },
						{ year: 2019 },
						{ year: 2020 },
						{ year: 2021 },
						{ year: 2022 },
						{ year: 2023 },
					];

	useEffect(() => {
		const observer = new MutationObserver(() => {
			const element = document.querySelector(
				"#areachart .recharts-xAxis",
			) as HTMLElement;
			if (element && barChartRef.current) {
				const { width: barChartWidth } =
					barChartRef.current.getBoundingClientRect();
				const actualWidth = element.getBoundingClientRect().width;
				const difference = barChartWidth - actualWidth;
				const setState = {
					width: barChartWidth + difference,
					difference,
				};
				setActualGraphWidth(setState);
				observer.disconnect();
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, []);
	return (
		<section id="areachart" className="mb-20">
			<h2>Was sind die größten Branchen?</h2>
			<p className="mb-20">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc iaculis
				malesuada nulla sit amet luctus. Suspendisse eget tellus orci. Aliquam
				sit amet viverra turpis. Maecenas facilisis eros at convallis vulputate.
				Ut ut posuere dolor. Fusce nec feugiat ipsum.
			</p>
			<p
				className="mb-10"
				onClick={() =>
					setGraph((prev) =>
						!prev ? "sektoren" : prev === "branchen" ? "sektoren" : "branchen",
					)
				}
			>
				Toggle Graph | Current: {graph}
			</p>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Icon id="filter" size={16} />
					<p className="bold">Filter</p>
				</div>
				<FilterDropdown
					filters={activeSektoren}
					filterList={start}
					onChange={(selectedFilters) => setActiveSektoren(selectedFilters)}
				/>
			</div>
			<div className="mt-10"></div>
			<div
				ref={barChartRef}
				style={{
					height: 300,
					width: actualGraphWidth?.width || "100%",
					transform: !!actualGraphWidth
						? `translateX(-${actualGraphWidth?.difference}px)`
						: "none",
				}}
			>
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={data}>
						<XAxis
							dataKey="year"
							stroke={theme === "dark" ? colors.white : colors.blue}
							strokeWidth={2}
							tick={{ style: { fontFamily: "Clan Pro, sans-serif" } }}
							// scale="time"
						/>
						<YAxis
							stroke={theme === "dark" ? colors.white : colors.blue}
							strokeWidth={2}
							tick={{ style: { fontFamily: "Clan Pro, sans-serif" } }}
						/>
						<Tooltip />
						{graph === "branchen" && (
							<>
								{branchen.map((branche) => (
									<Area
										key={branche.id}
										type="linear"
										dataKey={branche.id}
										stroke={theme === "dark" ? colors.white : colors.blue}
										strokeWidth={3}
										fill={branche.color}
									/>
								))}
							</>
						)}
						{graph === "sektoren" && (
							<>
								{sektoren
									.filter((sektor) => start.includes(sektor.id))
									.map((sektor) => (
										<Area
											key={sektor.id}
											type="linear"
											dataKey={sektor.id}
											stroke={
												justUseStrokeForGraph
													? activeSektoren.indexOf(sektor.id) === -1
														? sektor.color
														: theme === "dark"
															? hexToRgba(colors.white, 0.2)
															: hexToRgba(colors.blue, 0.2)
													: theme === "dark"
														? activeSektoren.indexOf(sektor.id) === -1
															? colors.white
															: hexToRgba(colors.white, 0.2)
														: activeSektoren.indexOf(sektor.id) === -1
															? colors.blue
															: hexToRgba(colors.blue, 0.2)
											}
											strokeWidth={3}
											fill={
												justUseStrokeForGraph
													? "none"
													: activeSektoren.indexOf(sektor.id) === -1
														? sektor.color
														: "none"
											}
										/>
									))}
							</>
						)}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</section>
	);
};

export default BarChartSection;
