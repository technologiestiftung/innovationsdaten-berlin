import React, { useEffect, useState } from "react";
import { BarChartTypes, BranchenItem } from "../types/global";
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
import { useGlobalContext } from "../GlobalContext";
import branchen from "../data/branchen.json";
import colors from "../data/colors.json";
import RegionToggle from "./RegionToggle";
import { formatNumber } from "../utilities";
import wordings from "../data/wordings.json";
import Dropdown from "./DropDown";

type BarChartProps = {
	id: string;
	data: any;
	bar_chart_type?: BarChartTypes;
	bar_chart_unit?: string;
	bar_chart_unit_breakpoint?: number;
	hasToggle?: boolean;
};

const BarChart: React.FC<BarChartProps> = ({
	id,
	data,
	bar_chart_type,
	bar_chart_unit,
	bar_chart_unit_breakpoint,
	hasToggle,
}) => {
	const { axisFontStylings, theme, fontSize } = useGlobalContext();
	const [sortBy, setSortBy] = useState<string | null>("umsatz_markt_neuheiten");
	const sortingAfter: Record<string, string[]> = {
		"added-value-through-product-innovation": [
			"umsatz_produkt_neuheiten",
			"umsatz_markt_neuheiten",
		],
	};

	if (!data) {
		return null;
	}

	let collectData = branchen.map((branche: BranchenItem) => {
		if (bar_chart_type === "stacked") {
			const getData = data.find((item: any) => item.id === branche.id);
			return {
				...branche,
				umsatz_markt_neuheiten: getData.umsatz_markt_neuheiten,
				umsatz_nachahmer_innovationen: getData.umsatz_nachahmer_innovationen,
				umsatz_produkt_neuheiten: getData.umsatz_produkt_neuheiten,
			};
		}
		if (id === "what_drives_environment_innovation") {
			return branche;
		}
		const getDelta = bar_chart_type === "normal" ? 0 : data[branche.id].delta;
		const getValue =
			bar_chart_type === "normal" ? data[branche.id] : data[branche.id].value;
		const getBreakPoint = bar_chart_unit_breakpoint || 0;
		return {
			name: branche.name,
			value: getValue,
			delta: getDelta > 0 ? getDelta : -getDelta,
			positiveDelta: getDelta > 0,
			isSmall: getValue < getBreakPoint,
			color: branche.color,
		};
	});

	if (id === "what_drives_environment_innovation") {
		collectData = [];
		Object.entries(data).map(([key, value]) => {
			const numValue = value as number;
			collectData.push({
				name: wordings[key as keyof typeof wordings],
				value: numValue,
				isSmall: numValue < (bar_chart_unit_breakpoint || 0),
				color: colors.blue,
				delta: 0,
				positiveDelta: false,
			});
		});
	}

	if (bar_chart_type !== "stacked") {
		collectData.sort((a: any, b: any) => {
			if (a.value < b.value) {
				return 1;
			}
			if (a.value > b.value) {
				return -1;
			}
			return 0;
		});
	} else if (sortBy) {
		collectData.sort((a: any, b: any) => {
			if (a[sortBy] < b[sortBy]) {
				return 1;
			}
			if (a[sortBy] > b[sortBy]) {
				return -1;
			}
			return 0;
		});
	}

	const RenderValueLabel = ({ x, y, width, height, value, index }: any) => {
		const paddingLabel = 10;
		const isSmall =
			"isSmall" in collectData[index] ? collectData[index].isSmall : false;
		const delta = "delta" in collectData[index] ? collectData[index].delta : 0;
		const positiveDelta =
			"positiveDelta" in collectData[index]
				? collectData[index].positiveDelta
				: false;
		const getFill = () => {
			if (bar_chart_type === "normal") {
				return colors.white;
			}
			if (theme === "dark") {
				return colors.white;
			}
			return colors.blue;
		};
		return (
			<>
				<text
					x={isSmall ? x + width + paddingLabel : x + width - paddingLabel}
					y={y + height / 2}
					textAnchor={isSmall ? "start" : "end"}
					dominantBaseline="middle"
					fontWeight="bold"
					fontFamily="Clan Pro"
				>
					<tspan
						fill={getFill()}
					>{`${formatNumber(value)} ${bar_chart_unit}`}</tspan>
					{bar_chart_type === "delta" && (
						<tspan fill={positiveDelta ? colors.green : colors.red} dx={6}>
							{positiveDelta ? "↑" : "↓"}
							{delta}
						</tspan>
					)}
				</text>
			</>
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
		return (
			<rect
				x={x}
				y={y}
				width={width}
				height={height}
				fill={payload?.positiveDelta ? colors.green : colors.red}
			/>
		);
	};

	const CustomTooltip = ({ active, payload }: any) => {
		if (!active || !payload || !payload.length) {
			return null;
		}
		const payloadData = payload[0].payload;
		const tollTipData = ["umsatz_markt_neuheiten", "umsatz_produkt_neuheiten"];
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
					{payloadData.name}
				</p>
				{tollTipData.map((key: string) => (
					<div className="flex justify-between gap-6" key={key}>
						{wordings[key as keyof typeof wordings] && (
							<p
								className="max-w-[150px] truncate"
								style={{
									color: theme === "dark" ? colors.dark : colors.white,
								}}
							>
								{wordings[key as keyof typeof wordings]}
							</p>
						)}
						<p
							className="bold ml-2"
							style={{
								color: theme === "dark" ? colors.dark : colors.white,
							}}
						>
							{formatNumber(payloadData[key])}
							{bar_chart_unit}
						</p>
					</div>
				))}
			</div>
		);
	};

	useEffect(() => {
		if (sortingAfter[id]) {
			setSortBy(sortingAfter[id][0]);
		}
	}, []);

	return (
		<>
			{hasToggle && <RegionToggle />}
			{sortingAfter[id] && (
				<Dropdown
					type="sort"
					sortingAfter={sortingAfter[id]}
					sortBy={sortBy}
					setSortBy={setSortBy}
				/>
			)}
			<div className="move-x-axis-tick-to-bottom hide-first-x-axis-tick">
				<ResponsiveContainer width="100%" height={window.innerHeight * 0.6}>
					<RechartsBarChart layout="vertical" data={collectData}>
						<YAxis
							type="category"
							dataKey="name"
							width={150}
							tick={{
								...axisFontStylings,
								fill: theme === "dark" ? colors.white : colors.blue,
							}}
							tickFormatter={(label: string) => {
								const maxLength = 15;
								return label.length > maxLength
									? `${label.slice(0, maxLength)}…`
									: label;
							}}
						/>
						{bar_chart_type === "stacked" && (
							<Tooltip content={<CustomTooltip />} />
						)}
						<CartesianGrid strokeDasharray="3 3" horizontal={false} />
						{bar_chart_type !== "stacked" && (
							<Bar
								dataKey="value"
								stackId="a"
								shape={
									bar_chart_type === "normal" ? <FilledBar /> : <BorderedBar />
								}
							>
								<LabelList
									content={(props) => {
										const { index } = props;
										if (index === undefined) {
											return null;
										}
										const current = collectData[index];
										if ("isSmall" in current && bar_chart_type === "delta") {
											return null;
										}
										return <RenderValueLabel {...props} />;
									}}
								/>
							</Bar>
						)}
						{bar_chart_type === "delta" && (
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
						{bar_chart_type === "stacked" && (
							<>
								<Bar
									dataKey="umsatz_markt_neuheiten"
									stackId="1"
									fill={colors.blue}
								/>
								<Bar
									dataKey="umsatz_nachahmer_innovationen"
									stackId="1"
									fill={colors.cyan_light}
								/>
								<Bar
									dataKey="umsatz_produkt_neuheiten"
									stackId="1"
									fill={colors.green_light}
								/>
							</>
						)}
						<XAxis
							type="number"
							mirror
							stroke="none"
							tick={{
								...axisFontStylings,
								fill: theme === "dark" ? colors.white : colors.blue,
								dy: 25,
							}}
						/>
					</RechartsBarChart>
				</ResponsiveContainer>
			</div>
		</>
	);
};

export default BarChart;
