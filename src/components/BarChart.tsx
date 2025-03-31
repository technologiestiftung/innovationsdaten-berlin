import React from "react";
import { BranchenItem } from "../types/global";
import {
	BarChart as RechartsBarChart,
	Bar,
	XAxis,
	YAxis,
	LabelList,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import { useGlobalContext } from "../GlobalContext";
import branchen from "../data/branchen.json";
import colors from "../data/colors.json";

type BarChartProps = {
	data: any;
	bar_chart_type?: "normal" | "delta";
	bar_chart_unit?: string;
	bar_chart_unit_breakpoint?: number;
};

const BarChart: React.FC<BarChartProps> = ({
	data,
	bar_chart_type,
	bar_chart_unit,
	bar_chart_unit_breakpoint,
}) => {
	const { axisFontStylings, theme } = useGlobalContext();
	if (!data) {
		return null;
	}
	const collectData = branchen
		.map((branche: BranchenItem) => {
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
		})
		.sort((a: any, b: any) => {
			if (a.value < b.value) {
				return 1;
			}
			if (a.value > b.value) {
				return -1;
			}
			return 0;
		});

	const RenderValueLabel = ({ x, y, width, height, value, index }: any) => {
		const paddingLabel = 10;
		const isSmall = collectData[index].isSmall;
		const delta = collectData[index].delta;
		const positiveDelta = collectData[index].positiveDelta;
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
					<tspan fill={getFill()}>{`${value} ${bar_chart_unit}`}</tspan>
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

	/* const CustomTooltip = ({ active, payload }: any) => {
		if (!active || !payload || !payload.length) {
			return null;
		}
		const payloadData = payload[0].payload;
		return (
			<div
				className="p-4 select-none"
				style={{
					backgroundColor: theme === "dark" ? colors.white : colors.blue,
				}}
			>
				<div className="flex justify-between gap-6">
					<p
						className="max-w-[100px] truncate"
						style={{
							color: theme === "dark" ? colors.dark : colors.white,
						}}
					>
						{payloadData?.name}
					</p>
					<p
						className="bold ml-2"
						style={{
							color: theme === "dark" ? colors.dark : colors.white,
						}}
					>
						{payloadData?.value} {bar_chart_unit}
					</p>
				</div>
			</div>
		);
	}; */

	return (
		<>
			<ResponsiveContainer width="100%" height={window.innerHeight * 0.7}>
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
					<CartesianGrid strokeDasharray="3 3" horizontal={false} />
					{/* <Tooltip content={<CustomTooltip />} /> */}
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
								if (current.isSmall && bar_chart_type === "delta") {
									return null;
								}
								return <RenderValueLabel {...props} />;
							}}
						/>
					</Bar>
					{bar_chart_type === "delta" && (
						<Bar dataKey="delta" stackId="a" shape={<DeltaBar />}>
							<LabelList
								content={(props) => {
									const { index } = props;
									if (index === undefined) {
										return null;
									}
									const current = collectData[index];
									if (!current.isSmall) {
										return null;
									}
									return <RenderValueLabel {...props} />;
								}}
							/>
						</Bar>
					)}

					<XAxis
						type="number"
						mirror
						stroke="none"
						tick={{
							...axisFontStylings,
							fill: theme === "dark" ? colors.white : colors.blue,
						}}
					/>
				</RechartsBarChart>
			</ResponsiveContainer>
		</>
	);
};

export default BarChart;
