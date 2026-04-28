import React from "react";
import { Bar } from "recharts";
import { useGlobalContext } from "@/GlobalContext";
import { getColorBar } from "@/components/charts/BarChart/utils";

type StackedBarProps = {
	chart_type: string;
	objectKeys: string[];
	id: string;
	has_tooltip?: boolean;
};

const StackedBar: React.FC<StackedBarProps> = ({
	chart_type,
	objectKeys,
	id,
	has_tooltip,
}: StackedBarProps) => {
	const { animationDuration } = useGlobalContext();
	if (!chart_type.includes("stacked")) {
		return null;
	}
	return (
		<>
			{objectKeys
				.filter(
					(objectKey) =>
						(id === "most_supported_branchen" && objectKey !== "total") ||
						(id !== "most_supported_branchen" &&
							!["insgesamt", "innovations_intensitaet"].includes(objectKey)),
				)
				.map((dataKey, index) => (
					<Bar
						key={dataKey}
						dataKey={dataKey}
						stackId="1"
						fill={getColorBar(index)}
						cursor={has_tooltip ? "pointer" : "default"}
						animationDuration={animationDuration}
					/>
				))}
		</>
	);
};

export default StackedBar;
