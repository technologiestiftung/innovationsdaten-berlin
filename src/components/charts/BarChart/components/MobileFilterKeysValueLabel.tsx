import React from "react";
import { LabelListProps } from "recharts";
import { getTransformY, wrapText } from "@/components/charts/BarChart/utils";

const MobileFilterKeysValueLabel: React.FC<
	LabelListProps & { payload?: any }
> = ({ x, y, value }: any) => {
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

export default MobileFilterKeysValueLabel;
