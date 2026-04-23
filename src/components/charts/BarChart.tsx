/* eslint-disable complexity */
/* eslint-disable no-nested-ternary */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BranchenItem, ChartTypes, dataKeys, Region } from "../../types/global";
import {
	BarChart as RechartsBarChart,
	Bar,
	XAxis,
	YAxis,
	LabelList,
	ResponsiveContainer,
	CartesianGrid,
	Tooltip,
	Legend,
	Cell,
} from "recharts";
import { useGlobalContext } from "../../GlobalContext";
import branchen from "../../data/branchen.json";
import colors from "../../data/colors.json";
import {
	cn,
	formatEuroNumber,
	formatNumber,
	sumNumericValues,
} from "../../utilities";
import wordings from "../../data/wordings.json";
import Dropdown from "./../DropDown";
import DataToggle from "../DataToggle";
import Icon from "../Icons";

type BarChartProps = {
	id: string;
	data: any;
	chart_type: ChartTypes;
	chart_unit?: string;
	has_tooltip?: boolean;
	max_value?: number;
	bar_chart_unit_breakpoint?: number;
	hasRegionToggle?: boolean;
	sortsAfter?: dataKeys[];
	sortsAfterOnStart?: string;
};

const BarChart: React.FC<BarChartProps> = ({
	id,
	data,
	chart_type,
	chart_unit,
	has_tooltip,
	max_value,
	bar_chart_unit_breakpoint,
	hasRegionToggle,
	sortsAfter,
	sortsAfterOnStart,
}) => {
	//
	//
	// consts
	const excludeKeyFromBranch = [
		"color",
		"id",
		"name",
		"sektor",
		"sektor_id",
		"umsatz_produkt_neuheiten",
	];
	const excludeKeyFromChart = ["insgesamt", "innovations_intensitaet"];
	const excludeKeyFromToolTip = [
		"umsatz_nachahmer_innovationen",
		"differenz_intensitaet",
		"total",
	];
	if (
		id === "inno_intensitaet" ||
		id === "protective_measures_intellectual_property"
	) {
		excludeKeyFromToolTip.push("insgesamt");
	}
	const excludeKeyFromAllFilters = ["id", "name", "isSmall", "color"];
	// const widthOfStickyContainer = window.innerWidth * (3 / 5) - 24;
	//
	//
	// global context
	const {
		axisFontStylings,
		region,
		setRegion,
		// windowMeasuresOnStart,
		isMobile,
	} = useGlobalContext();
	//
	//
	// utils
	const getBarCategoryGap = () => {
		if (
			isMobile &&
			chart_type.includes("filter_keys") &&
			!chart_type.includes("branchen")
		) {
			return "25%";
		}
		return "10%";
	};
	const wrapTextForCustomLineHeightYAxisTick = (
		text: string,
		maxCharsPerLine = 30,
	) => {
		const words = text.split(" ");
		const lines = [];
		let currentLine = "";

		words.forEach((word) => {
			if ((currentLine + word).length > maxCharsPerLine) {
				lines.push(currentLine.trim());
				currentLine = word + " ";
			} else {
				currentLine += word + " ";
			}
		});

		lines.push(currentLine.trim());
		return lines;
	};
	const getColorBar = (index: number) => {
		if (!index) {
			return colors.blue;
		}
		if (index === 1) {
			return colors.cyan_light;
		}
		if (index === 2) {
			return colors.green_light;
		}
		if (index === 3) {
			return colors.bar_chart_3;
		}
		if (index === 4) {
			return colors.bar_chart_4;
		}
		return colors.blue;
	};
	const wrapText = (text: string): string[] => {
		const words = text.split(" ");
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		const fontSizeMobileValue = 14;
		const fontFamily = "Clan Pro";
		const maxWidth = window.innerWidth - 48;
		if (!context) {
			return [text];
		}

		context.font = `${fontSizeMobileValue}px "${fontFamily}", sans-serif`;
		const lines: string[] = [];
		let currentLine = "";

		for (const word of words) {
			const testLine = currentLine ? currentLine + " " + word : word;
			const { width } = context.measureText(testLine);
			if (width > maxWidth && currentLine !== "") {
				lines.push(currentLine);
				currentLine = word;
			} else {
				currentLine = testLine;
			}
		}
		if (currentLine) {
			lines.push(currentLine);
		}
		return lines;
	};
	const getTransformY = (name: string) => {
		const lines = wrapText(name);
		return lines.length - 1;
	};
	//
	//
	// refs
	const optionsRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<HTMLDivElement>(null);
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
	const collectData = useMemo(() => {
		if (!data) {
			return [];
		}
		let result: any = [];

		if (!chart_type.includes("filter_keys")) {
			result = branchen.map((branche: BranchenItem) => {
				// stacked
				if (chart_type.includes("stacked")) {
					const getData = data.find((item: any) => item.id === branche.id);
					if (id === "most_supported_branchen") {
						const getTotal = sumNumericValues(getData);
						return {
							...branche,
							...getData,
							total: getTotal,
						};
					}
					if ("insgesamt" in getData) {
						return {
							...branche,
							...getData,
						};
					}
					const getInsgesamt = sumNumericValues(getData);
					return {
						...branche,
						...getData,
						insgesamt: getInsgesamt,
					};
				}
				// delta & normal
				const getDelta =
					chart_type === "bar_chart" ? 0 : data[branche.id].delta;
				const getValue =
					chart_type === "bar_chart"
						? data[branche.id]
						: data[branche.id].value;
				const getBreakPoint = bar_chart_unit_breakpoint || 0;
				return {
					id: branche.id,
					name: branche.name,
					value: getValue,
					delta: getDelta > 0 ? getDelta : -getDelta,
					positiveDelta: getDelta > 0,
					isSmall: getValue < getBreakPoint,
					color: branche.color,
				};
			});
		} else {
			result = data.map((item: any) => {
				const getID = item.id;
				const getBreakPoint = bar_chart_unit_breakpoint || 0;
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
					isSmall: getValue < getBreakPoint,
					color: findBranche?.color || colors.blue,
					...item,
				};
			});
		}

		// Sort
		let getSortBy: string | null | undefined = null;

		if (sortBy) {
			getSortBy = sortBy;
		} else if (
			result.some((item: any) => "insgesamt" in item) &&
			!result.some((item: any) => "total" in item)
		) {
			getSortBy = "insgesamt";
		} else if (Array.isArray(sortsAfter)) {
			getSortBy = sortsAfter[0];
		}

		if (!getSortBy && sortsAfterOnStart) {
			getSortBy = sortsAfterOnStart;
		}

		result.sort((a: any, b: any) => {
			const key = getSortBy || "value";
			if (a[key] < b[key]) {
				return 1;
			}
			if (a[key] > b[key]) {
				return -1;
			}
			return 0;
		});

		return result;
	}, [data, sortBy, chart_type, id]);
	let objectKeys: any[] = [];
	if (data && collectData.length > 0) {
		objectKeys = Object.keys(collectData[0]).filter(
			(dataKey) =>
				!excludeKeyFromBranch.includes(dataKey) && !dataKey.includes("display"),
		);
	}
	const dataIsBasedOnBranchen = collectData.some(
		(findData: any) => findData.id === "holz",
	);

	//
	//
	// components
	const CustomMobileTick = (props: any) => {
		const { y, payload } = props;

		const findBrancheInTick = branchen.find(
			(findBranche) => findBranche.name === payload.value,
		);

		return (
			<g transform={`translate(${0}, ${y - 13})`}>
				<Icon id={findBrancheInTick?.id} className="size-6 text-foreground" />
			</g>
		);
	};
	const CustomLineHeightYAxisTick = (props: any) => {
		const { x, y, payload } = props;
		const lines = wrapTextForCustomLineHeightYAxisTick(payload.value);
		const lineHeight = 14;
		const offsetY =
			y - ((lines.length - 1) * lineHeight) / 2 + lineHeight * 0.25;

		return (
			<text
				x={x}
				y={offsetY}
				textAnchor="end"
				style={{
					fontFamily: "Clan Pro",
					fontSize: 12,
					fill: "var(--foreground)",
					fontWeight: "initial",
				}}
			>
				{lines.map((line, index) => (
					<tspan key={index} x={x} dy={index === 0 ? 0 : lineHeight}>
						{line}
					</tspan>
				))}
			</text>
		);
	};
	const RenderCustomLegend = (props: any) => {
		const { payload } = props;
		return (
			<ul className="flex flex-wrap list-none p-0 mt-10">
				{payload.map((entry: any, index: number) => (
					<li key={`item-${index}`} className="flex items-center mr-4">
						<div
							className="inline-block w-3 h-3 mr-2 bg-[var(--bg)]"
							style={{ "--bg": entry.color } as React.CSSProperties}
						/>
						<p className="text-[12px] leading-[14.4px]">
							{wordings[entry.value as keyof typeof wordings] || entry.value}
						</p>
					</li>
				))}
			</ul>
		);
	};
	const CustomTooltip = ({ active, payload }: any) => {
		if (!active || !payload || !payload.length) {
			return null;
		}
		const payloadData = payload[0].payload;
		return (
			<div
				className="p-4 select-none bg-foreground max-lg:max-w-[var(--max-width)]"
				style={
					{ "--max-width": window.innerWidth * 0.75 } as React.CSSProperties
				}
			>
				<p className="font-bold text-background mb-4">{payloadData.name}</p>
				{!chart_type.includes("filter_keys") ? (
					<>
						{objectKeys
							.filter((objectKey) => !excludeKeyFromToolTip.includes(objectKey))
							.sort((a, b) => {
								if (a === "fue_intensitaet") {
									return -1;
								}
								if (b === "fue_intensitaet") {
									return 1;
								}
								return 0;
							})
							.map((key: string) => (
								<div className="flex justify-between gap-6" key={key}>
									{wordings[key as keyof typeof wordings] && (
										<p className="text-background">
											{wordings[key as keyof typeof wordings]}:
										</p>
									)}
									<p className="font-bold ml-2 text-background">
										{formatNumber(payloadData[key])}
										{chart_unit}
									</p>
								</div>
							))}
					</>
				) : (
					<>
						<div className="flex justify-between gap-6">
							<p className="first-letter:capitalize text-background">
								{activeFilter}
							</p>
							<p className="font-bold ml-2 text-background">
								{formatNumber(payloadData[activeFilter || ""])}
								{chart_unit}
							</p>
						</div>
					</>
				)}
			</div>
		);
	};
	const RenderValueLabel = ({ x, y, width, height, value, index }: any) => {
		const paddingLabel = 10;
		if (!collectData[index]) {
			return null;
		}
		const isSmall =
			"isSmall" in collectData[index] ? collectData[index].isSmall : false;
		const delta = "delta" in collectData[index] ? collectData[index].delta : 0;
		const positiveDelta =
			"positiveDelta" in collectData[index]
				? collectData[index].positiveDelta
				: false;
		const getValue = chart_type.includes("delta")
			? collectData[index].value
			: value;
		const getFill = () => {
			if (!isSmall && chart_type.includes("delta")) {
				return "var(--foreground)";
			}
			if (isSmall) {
				return "var(--foreground)";
			}
			return colors.white;
		};
		const getNegativeDeltaWidth = () => {
			const bars = document.querySelectorAll(
				`#${id} .recharts-bar:last-of-type .recharts-bar-rectangle rect`,
			);
			const el = bars[index] as SVGRectElement | undefined;
			if (!el) {
				return 0;
			}
			return el ? Number(el.getAttribute("width")) : 0;
		};
		const setX = () => {
			if (!chart_type.includes("delta")) {
				return isSmall ? x + width + paddingLabel : x + width - paddingLabel;
			}
			const deltaWidth = getNegativeDeltaWidth();
			if (positiveDelta) {
				return isSmall ? x + paddingLabel + deltaWidth : x - paddingLabel;
			}
			return isSmall ? x + paddingLabel : x - paddingLabel - deltaWidth;
		};
		return (
			<text
				x={setX()}
				y={y + height / 2}
				textAnchor={isSmall ? "start" : "end"}
				dominantBaseline="middle"
				fontWeight="bold"
				fontFamily="Clan Pro"
			>
				{chart_type.includes("delta") && (
					<>
						<tspan fill={getFill()}>{formatNumber(getValue)}</tspan>
						<tspan fill={positiveDelta ? colors.green : colors.red} dx={6}>
							{positiveDelta ? "+" : "-"}
							{formatNumber(delta)}
						</tspan>
					</>
				)}
				{chart_unit === "€" && !chart_type.includes("delta") && (
					<>
						<tspan fill={getFill()}>{formatNumber(getValue)}</tspan>
					</>
				)}
				{chart_unit === "%" && (
					<tspan fill={getFill()}>
						{formatNumber(value)} {chart_unit}
					</tspan>
				)}
			</text>
		);
	};
	const RenderMobileFilterKeysValueLabelTesting = ({ x, y, value }: any) => {
		const safeY = typeof y === "number" ? y - 7.5 : 0;
		const safeX = typeof x === "number" ? x + 5 : 0;
		const fontSizeMobileValue = 14;
		const fontFamily = "Clan Pro";

		const lines = wrapText(value);

		return (
			<text
				x={safeX}
				y={safeY}
				fill="var(--foreground)"
				fontFamily={fontFamily}
				fontSize={fontSizeMobileValue}
				textAnchor="start"
				transform={`translate(-5, ${getTransformY(value) * -14})`}
			>
				{lines.map((line, i) => (
					<tspan key={i} x={safeX} dy={i === 0 ? 0 : "1.2em"}>
						{line}
					</tspan>
				))}
			</text>
		);
	};
	const BorderedBar = (props: any) => {
		const { x, y, width, height } = props;
		return (
			<rect
				x={x}
				y={y}
				width={width}
				height={height}
				stroke="var(--foreground)"
				fill="none"
				strokeWidth={2}
			/>
		);
	};
	const FilledBar = (props: any) => {
		const { x, y, width, height, payload } = props;
		return (
			<rect x={x} y={y} width={width} height={height} fill={payload?.color} />
		);
	};
	const DeltaBarStroke = (props: any) => {
		const { x, y, width, height, payload } = props;
		const fill = payload?.positiveDelta
			? "url(#green-stripes)"
			: "url(#red-stripes)";

		return (
			<rect
				x={x}
				y={y}
				width={width}
				height={payload?.positiveDelta ? height : height - 2}
				fill={fill}
				transform={
					payload?.positiveDelta
						? `translate(1, 0)`
						: `translate(-${width + 1}, 1)`
				}
			/>
		);
	};

	//
	//
	// use effects
	useEffect(() => {
		setTimeout(() => {
			if (!chartRef.current) {
				return;
			}
			const axisTicksEl = chartRef.current.querySelector(
				".recharts-yAxis-tick-labels",
			);
			if (axisTicksEl) {
				const rect = axisTicksEl.getBoundingClientRect();
				setYAxisWidth(rect.width + 6);
			}
		}, 100);
	}, [id]);
	useEffect(() => {
		if (chart_type.includes("filter_keys") && !!collectData.length) {
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

	//
	//
	// return
	if (!data) {
		return <h4>BarChart Data missing</h4>;
	}

	//
	//
	// render
	return (
		<>
			<div
				ref={chartRef}
				className={cn(
					"hide-first-x-axis-tick move-recharts-label",
					chart_type === "bar_chart_filter_keys"
						? Object.keys(collectData).length <= 5
							? "h-[30vh]"
							: "h-[45vh]"
						: "h-[60vh]",
				)}
				id={id}
			>
				<ResponsiveContainer width="100%" height="100%">
					<RechartsBarChart
						layout="vertical"
						data={collectData}
						barCategoryGap={getBarCategoryGap()}
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
						{has_tooltip && <Tooltip content={<CustomTooltip />} />}
						{/* Grid */}
						<CartesianGrid strokeDasharray="3 3" horizontal={false} />
						{/* Legend */}
						{chart_type.includes("stacked") && (
							<Legend content={RenderCustomLegend} />
						)}
						{/* Bars */}
						{(chart_type.includes("delta") || chart_type === "bar_chart") && (
							<Bar
								dataKey="value"
								stackId="a"
								shape={
									chart_type === "bar_chart" ? <FilledBar /> : <BorderedBar />
								}
								cursor={has_tooltip ? "pointer" : "default"}
							>
								<LabelList
									content={(props) => {
										const { index } = props;
										if (index === undefined) {
											return null;
										}
										const current = collectData[index];
										if ("isSmall" in current && chart_type.includes("delta")) {
											return null;
										}
										return <RenderValueLabel {...props} />;
									}}
								/>
							</Bar>
						)}
						{chart_type.includes("delta") && (
							<Bar dataKey="delta" stackId="a" shape={<DeltaBarStroke />}>
								<LabelList
									content={(props) => {
										const { index } = props;
										if (index === undefined) {
											return null;
										}
										const current = collectData[index];
										if (!("isSmall" in current)) {
											return null;
										}
										return <RenderValueLabel {...props} />;
									}}
								/>
							</Bar>
						)}
						{chart_type.includes("stacked") && (
							<>
								{objectKeys
									.filter(
										(objectKey) =>
											(id === "most_supported_branchen" &&
												objectKey !== "total") ||
											(id !== "most_supported_branchen" &&
												!excludeKeyFromChart.includes(objectKey)),
									)
									.map((dataKey, index) => (
										<Bar
											key={dataKey}
											dataKey={dataKey}
											stackId="1"
											fill={getColorBar(index)}
											cursor={has_tooltip ? "pointer" : "default"}
										/>
									))}
							</>
						)}
						{chart_type.includes("filter_keys") && activeFilter && (
							<>
								{chart_type.includes("branchen") ? (
									<Bar
										key={`${activeFilter}-${data.length}-${JSON.stringify(data.map((d: any) => d.id))}`}
										dataKey={activeFilter}
										stackId="1"
										cursor={has_tooltip ? "pointer" : "default"}
									>
										{collectData.map((entry: any) => (
											<Cell key={entry.id} fill={entry.color} />
										))}
										<LabelList content={<RenderValueLabel />} />
									</Bar>
								) : (
									<Bar
										key={activeFilter}
										dataKey={activeFilter}
										stackId="1"
										fill={colors.blue}
										cursor={has_tooltip ? "pointer" : "default"}
									>
										{isMobile && (
											<LabelList
												dataKey="name"
												content={<RenderMobileFilterKeysValueLabelTesting />}
											/>
										)}
										<LabelList content={<RenderValueLabel />} />
									</Bar>
								)}
							</>
						)}
						{/* XAxis */}
						<XAxis
							type="number"
							mirror
							stroke="none"
							domain={max_value ? [0, max_value] : ["auto", "auto"]}
							tick={{
								...axisFontStylings,
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
			</div>
			<div
				className="flex max-xl:flex-col max-xl:items-end max-xl:gap-2 xl:items-center xl:gap-8 xl:justify-end mt-2 md:mt-6 xl:mt-8"
				ref={optionsRef}
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
