/* eslint-disable complexity */

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
} from "recharts";
import { useGlobalContext } from "../../GlobalContext";
import branchen from "../../data/branchen.json";
import colors from "../../data/colors.json";
import {
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
	multiline_y_axis_label?: boolean;
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
	multiline_y_axis_label,
	bar_chart_unit_breakpoint,
	hasRegionToggle,
	sortsAfter,
	sortsAfterOnStart,
}) => {
	// Global Context
	const {
		axisFontStylings,
		theme,
		fontSize,
		region,
		setRegion,
		widthOfStickyContainer,
		isMobile,
		headerHeight,
	} = useGlobalContext();

	// Exclude keys from data
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
	const excludeKeyFromAllFilters = ["id", "name", "isSmall"];

	let yAxisWidth = 0;
	if (isMobile) {
		yAxisWidth = widthOfStickyContainer * 0.3;
	} else if (multiline_y_axis_label) {
		yAxisWidth = widthOfStickyContainer * 0.4;
	} else {
		yAxisWidth = widthOfStickyContainer * 0.25;
	}

	const optionsRef = useRef<HTMLDivElement>(null);

	// State
	const [sortBy, setSortBy] = useState<string | null>(null);
	const [allFilters, setAllFilters] = useState<string[] | null>([]);
	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const [heightOfOptions, setHeightOfOptions] = useState<number>(0);

	// set Data
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
					const getIngesamt = sumNumericValues(getData);
					return {
						...branche,
						...getData,
						insgesamt: getIngesamt,
					};
				}
				// full
				if (chart_type.includes("full")) {
					const getData = data
						.map((item: any) => {
							const total =
								item.product_innovation_share + item.process_innovation_share;

							const rawProduct = (item.product_innovation_share / total) * 100;
							const roundedProduct = Math.round(rawProduct);
							const roundedProcess = Math.round(100 - roundedProduct);

							return {
								id: item.id,
								product_innovation_share: roundedProduct,
								process_innovation_share: roundedProcess,
								display_product_innovation_share: item.product_innovation_share,
								display_process_innovation_share: item.process_innovation_share,
							};
						})
						.find((item: any) => item.id === branche.id);

					return {
						...branche,
						...getData,
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
		}

		if (chart_type.includes("filter_keys")) {
			result = data.map((item: any) => {
				const getID = item.id;
				const getBreakPoint = bar_chart_unit_breakpoint || 0;
				const getValue = item[activeFilter || "insgesamt"];
				return {
					name: wordings[getID as keyof typeof wordings],
					isSmall: getValue < getBreakPoint,
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
	}, [data, sortBy, chart_type, id, theme]);

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

	const RenderValueLabel = ({ x, y, width, height, value, index }: any) => {
		const paddingLabel = 10;
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
			if (chart_type === "bar_chart") {
				return isSmall && theme === "light" ? colors.blue : colors.white;
			}
			if (!isSmall) {
				return colors.white;
			}
			if (theme === "dark") {
				return colors.white;
			}
			return colors.blue;
		};
		const setX = () => {
			if (chart_type.includes("delta") && !isSmall) {
				return x - paddingLabel;
			}
			if (isSmall) {
				return x + width + paddingLabel;
			}
			return x + width - paddingLabel;
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
				{(chart_type.includes("delta") || chart_unit === "€") && (
					<>
						{/* Value Display */}
						<tspan fill={getFill()}>{formatNumber(getValue)}</tspan>
						{chart_type.includes("delta") && (
							<tspan fill={positiveDelta ? colors.green : colors.red} dx={6}>
								{positiveDelta ? "↑" : "↓"}
								{formatNumber(delta)}
							</tspan>
						)}
					</>
				)}
				{chart_unit === "%" && (
					<tspan fill={getFill()}>
						{/* Value Display */}
						{formatNumber(value)} {chart_unit}
					</tspan>
				)}
			</text>
		);
	};
	const RenderMobileFilterKeysValueLabel = ({ x, y, value }: any) => {
		const safeY = typeof y === "number" ? y - 7.5 : 0;
		const safeX = typeof x === "number" ? x + 5 : 0;
		const maxWidth = window.innerWidth * 0.8;
		const fontSizeMobileValue = 14;
		const fontFamily = "Clan Pro";

		const getTruncatedText = (textString: string, maxWidthText: number) => {
			let makeTextString = textString;
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");
			if (!context) {
				return makeTextString;
			}
			context.font = `${fontSizeMobileValue}px "${fontFamily}", sans-serif`;

			const widthText = context.measureText(makeTextString).width;
			if (widthText <= maxWidthText) {
				return makeTextString;
			}

			while (
				makeTextString.length > 0 &&
				context.measureText(makeTextString + "...").width > maxWidth
			) {
				makeTextString = makeTextString.slice(0, -1);
			}
			return makeTextString + "...";
		};
		const truncated = getTruncatedText(value, maxWidth);

		return (
			<text
				x={safeX}
				y={safeY}
				fill={theme === "dark" ? colors.white : colors.blue}
				fontWeight="bold"
				fontFamily={fontFamily}
				fontSize={fontSizeMobileValue}
				textAnchor="start"
			>
				{truncated}
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
				stroke={theme === "dark" ? colors.white : colors.blue}
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
	const DeltaBar = (props: any) => {
		const { x, y, width, height, payload } = props;
		const getColor = payload?.positiveDelta ? colors.green : colors.red;
		return (
			<rect
				x={x}
				y={y}
				width={width}
				height={height}
				fill={getColor}
				stroke={getColor}
				strokeWidth={2}
			/>
		);
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
	const getHeight = () => {
		if (isMobile) {
			return (
				window.innerHeight -
				headerHeight -
				heightOfOptions -
				window.innerHeight * 0.075
			);
		}

		if (Object.keys(collectData).length <= 4) {
			return window.innerHeight * 0.4;
		}

		return window.innerHeight * 0.6;
	};

	const getBarCategoryGap = () => {
		if (isMobile && chart_type.includes("filter_keys")) {
			return "25%";
		}
		return "10%";
	};

	const CustomTooltip = ({ active, payload }: any) => {
		if (!active || !payload || !payload.length) {
			return null;
		}
		const payloadData = payload[0].payload;
		return (
			<div
				className="p-4 select-none"
				style={{
					backgroundColor: theme === "dark" ? colors.white : colors.blue,
					maxWidth: isMobile ? window.innerWidth * 0.75 : "none",
				}}
			>
				<p
					className="bold max-w-[350px]"
					style={{
						color: theme === "dark" ? colors.dark : colors.white,
						marginBottom: fontSize,
					}}
				>
					{payloadData.name}
				</p>
				{!chart_type.includes("filter_keys") ? (
					<>
						{/* inno_intensitaet | protective_measures_intellectual_property */}
						{objectKeys
							.filter((objectKey) => !excludeKeyFromToolTip.includes(objectKey))
							.map((key: string) => (
								<div className="flex justify-between gap-6" key={key}>
									{wordings[key as keyof typeof wordings] && (
										<p
											style={{
												color: theme === "dark" ? colors.dark : colors.white,
											}}
										>
											{wordings[key as keyof typeof wordings]}:
										</p>
									)}
									<p
										className="bold ml-2"
										style={{
											color: theme === "dark" ? colors.dark : colors.white,
										}}
									>
										{/* Value Display */}
										{chart_type.includes("full")
											? `${formatNumber(payloadData[key])} | ${formatNumber(payloadData[`display_${key}`])}%`
											: formatNumber(payloadData[key])}
										{chart_unit}
									</p>
								</div>
							))}
					</>
				) : (
					<>
						<div className="flex justify-between gap-6">
							<p
								className="first-letter:capitalize"
								style={{
									color: theme === "dark" ? colors.dark : colors.white,
								}}
							>
								{activeFilter}
							</p>
							<p
								className="bold ml-2"
								style={{
									color: theme === "dark" ? colors.dark : colors.white,
								}}
							>
								{/* Value Display */}
								{formatNumber(payloadData[activeFilter || ""])}
								{chart_unit}
							</p>
						</div>
					</>
				)}
			</div>
		);
	};

	const CustomMobileTick = ({ y, payload }: any) => {
		const findBrancheInTick = branchen.find(
			(findBranche) => findBranche.name === payload.value,
		);
		return (
			<g transform={`translate(${0}, ${y - 12})`}>
				<Icon id={findBrancheInTick?.id} />
			</g>
		);
	};

	useEffect(() => {
		if (Array.isArray(sortsAfter) && sortsAfter.length > 0) {
			setSortBy(sortsAfter[0]);
		} else {
			setSortBy(null);
		}
	}, [sortsAfter, id]);

	useEffect(() => {
		if (chart_type.includes("filter_keys")) {
			setSortBy(activeFilter);
		}
	}, [activeFilter]);

	useEffect(() => {
		if (chart_type.includes("full")) {
			setSortBy("process_innovation_share");
		}
	}, [region]);

	useEffect(() => {
		if (chart_type.includes("filter_keys") && !!collectData.length) {
			const getAllFilters = Object.keys(collectData[0]).filter(
				(key) => !excludeKeyFromAllFilters.includes(key),
			);
			if (getAllFilters.length) {
				setAllFilters(getAllFilters);
				setActiveFilter("insgesamt");
			}
		}
	}, [id]);

	useEffect(() => {
		if (optionsRef.current) {
			const optionsHeight = optionsRef.current.getBoundingClientRect().height;
			setHeightOfOptions(optionsHeight);
		}
	}, [optionsRef.current]);

	if (!data) {
		return <h4>BarChart Data missing</h4>;
	}

	return (
		<>
			<div className="move-x-axis-tick-to-bottom hide-first-x-axis-tick move-recharts-label">
				<ResponsiveContainer width="100%" height={getHeight()}>
					<RechartsBarChart
						layout="vertical"
						data={collectData}
						barCategoryGap={getBarCategoryGap()}
					>
						{/* YAxis */}
						<YAxis
							type="category"
							dataKey="name"
							hide={isMobile && !dataIsBasedOnBranchen}
							width={isMobile && dataIsBasedOnBranchen ? 30 : yAxisWidth}
							tick={
								isMobile && dataIsBasedOnBranchen ? (
									<CustomMobileTick />
								) : (
									{
										fontFamily: "Clan Pro",
										fontSize: 12,
										fill: theme === "dark" ? colors.white : colors.blue,
										fontWeight: "initial",
									}
								)
							}
						/>
						{/* ToolTip */}
						{has_tooltip && <Tooltip content={<CustomTooltip />} />}
						{/* Grid */}
						<CartesianGrid strokeDasharray="3 3" horizontal={false} />
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
							<Bar dataKey="delta" stackId="a" shape={<DeltaBar />}>
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
						{(chart_type.includes("stacked") ||
							chart_type.includes("full")) && (
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
										position="top"
										content={<RenderMobileFilterKeysValueLabel />}
									/>
								)}
								<LabelList content={<RenderValueLabel />} />
							</Bar>
						)}
						{/* XAxis */}
						<XAxis
							type="number"
							mirror
							stroke="none"
							hide={chart_type.includes("full")}
							domain={chart_type.includes("full") ? [0, 100] : ["auto", "auto"]}
							tick={{
								...axisFontStylings,
								fill: theme === "dark" ? colors.white : colors.blue,
								dy: 25,
							}}
							// Value Display
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
				className={`flex ${isMobile ? "flex-col items-end mt-8 gap-2" : "items-center mt-8 gap-8 justify-end"}`}
				ref={optionsRef}
			>
				{hasRegionToggle && (
					<DataToggle
						data={region}
						setData={(value: string) => setRegion(value as Region)}
						allDatas={["ber", "de"]}
					/>
				)}
				{sortBy && !activeFilter && !chart_type.includes("full") && (
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
					/>
				)}
			</div>
		</>
	);
};

export default BarChart;
