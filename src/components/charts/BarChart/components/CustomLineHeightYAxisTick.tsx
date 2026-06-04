import React, { CSSProperties } from "react";
import { wrapTextForCustomLineHeightYAxisTick } from "@/components/charts/BarChart/utils";

type CustomLineHeightYAxisTickProps = {
	x?: number;
	y?: number;
	payload?: {
		value: string;
	};
};

const CustomLineHeightYAxisTick: React.FC<CustomLineHeightYAxisTickProps> = ({
	x = 0,
	y = 0,
	payload,
}) => {
	if (!payload?.value) {
		return null;
	}
	const lines = wrapTextForCustomLineHeightYAxisTick(payload.value);
	const lineHeight = 14;
	const offsetY = y - ((lines.length - 1) * lineHeight) / 2 + lineHeight * 0.25;

	const textStyle: CSSProperties = {
		fontFamily: "Clan Pro",
		fontSize: 12,
		fill: "var(--foreground)",
		fontWeight: "normal",
	};

	return (
		<text x={x} y={offsetY} textAnchor="end" style={textStyle}>
			{lines.map((line, index) => (
				<tspan key={index} x={x} dy={index === 0 ? 0 : lineHeight}>
					{line}
				</tspan>
			))}
		</text>
	);
};

export default CustomLineHeightYAxisTick;
