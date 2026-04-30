import { ChartData } from "@/types/global";
import { cn } from "@/utilities";
import React, { CSSProperties } from "react";

type BarChartWrapperProps = {
	id: string;
	chart_type: string;
	collectData: ChartData;
	children: React.ReactNode;
};

const BarChartWrapper: React.FC<BarChartWrapperProps> = ({
	id,
	chart_type,
	collectData,
	children,
}: BarChartWrapperProps) => {
	const heightOfSingleBar = chart_type.includes("filter_keys") ? 120 : 60;
	return (
		<div
			id={id}
			className={cn(
				"hide-first-x-axis-tick move-recharts-label h-[var(--bar-chart-wrapper-height)]",
				Object.keys(collectData).length <= 5 ? "lg:h-[40vh]" : "lg:h-[70vh]",
			)}
			style={
				{
					"--bar-chart-wrapper-height": `${heightOfSingleBar * Object.keys(collectData).length}px`,
				} as CSSProperties
			}
		>
			{children}
		</div>
	);
};

export default BarChartWrapper;
