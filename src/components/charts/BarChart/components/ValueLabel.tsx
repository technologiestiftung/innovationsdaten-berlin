/* eslint-disable complexity */

import React from "react";
import { LabelProps } from "recharts";
import colors from "@/data/colors.json";
import { formatNumber } from "@/utilities";

type ValueLabelProps = Partial<LabelProps> & {
	collectData: any[];
	chart_type: string;
	chart_unit: string | undefined;
	id: string;
};

const ValueLabel: React.FC<ValueLabelProps> = ({
	// LabelProps
	x = 0,
	y = 0,
	width = 0,
	height = 0,
	value,
	index,
	// Custom props
	collectData,
	chart_type,
	chart_unit,
	id,
}: ValueLabelProps) => {
	const paddingLabel = 10;
	if (
		typeof index !== "number" ||
		!collectData ||
		!collectData[index] ||
		!chart_type ||
		!id
	) {
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

	const numericValue = typeof value === "number" ? value : Number(value ?? 0);

	const toNumber = (v: string | number | undefined) =>
		typeof v === "number" ? v : Number(v ?? 0);

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
		const numX = typeof x === "number" ? x : Number(x ?? 0);
		const numWidth = typeof width === "number" ? width : Number(width ?? 0);
		if (!chart_type.includes("delta")) {
			return isSmall
				? numX + numWidth + paddingLabel
				: numX + numWidth - paddingLabel;
		}
		const deltaWidth = getNegativeDeltaWidth();
		if (positiveDelta) {
			return isSmall ? numX + paddingLabel + deltaWidth : numX - paddingLabel;
		}
		return isSmall ? numX + paddingLabel : numX - paddingLabel - deltaWidth;
	};
	return (
		<text
			x={setX()}
			y={toNumber(y) + toNumber(height) / 2}
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
					{formatNumber(numericValue)} {chart_unit}
				</tspan>
			)}
		</text>
	);
};

export default ValueLabel;
