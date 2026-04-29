import React from "react";
import { Bar, LabelList } from "recharts";
import DeltaBarStroke from "./DeltaBarStroke";
import { useGlobalContext } from "@/GlobalContext";
import ValueLabel from "./ValueLabel";
import { ChartData } from "@/types/global";

type DeltaBarProps = {
	chart_type: string;
	collectData: ChartData[];
	chart_unit?: string;
	id: string;
};

const DeltaBar: React.FC<DeltaBarProps> = ({
	chart_type,
	collectData,
	chart_unit,
	id,
}: DeltaBarProps) => {
	const { animationDuration } = useGlobalContext();
	if (!chart_type.includes("delta")) {
		return null;
	}
	return (
		<Bar
			dataKey="delta"
			stackId="a"
			shape={<DeltaBarStroke />}
			animationDuration={animationDuration}
		>
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

export default DeltaBar;
