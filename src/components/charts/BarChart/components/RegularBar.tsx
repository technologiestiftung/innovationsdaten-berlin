import React from "react";
import { Bar, LabelList } from "recharts";
import FilledBar from "./FilledBar";
import BorderedBar from "./BorderedBar";
import { useGlobalContext } from "@/GlobalContext";
import ValueLabel from "./ValueLabel";

type RegularBarProps = {
	chart_type: string;
	has_tooltip?: boolean;
	collectData: any[];
	chart_unit?: string;
	id: string;
};

const RegularBar: React.FC<RegularBarProps> = ({
	chart_type,
	has_tooltip,
	collectData,
	chart_unit,
	id,
}: RegularBarProps) => {
	const { animationDuration } = useGlobalContext();
	if (!chart_type.includes("delta") && chart_type !== "bar_chart") {
		return null;
	}
	return (
		<Bar
			dataKey="value"
			stackId="a"
			shape={chart_type === "bar_chart" ? <FilledBar /> : <BorderedBar />}
			cursor={has_tooltip ? "pointer" : "default"}
			animationDuration={animationDuration}
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
					return (
						<ValueLabel
							{...props}
							collectData={collectData}
							chart_type={chart_type}
							chart_unit={chart_unit}
							id={id}
						/>
					);
				}}
			/>
		</Bar>
	);
};

export default RegularBar;
