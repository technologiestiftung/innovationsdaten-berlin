/* eslint-disable no-nested-ternary */

import { useGlobalContext } from "@/GlobalContext";
import { ChartData } from "@/types/global";
import { cn } from "@/utilities";
import React, { CSSProperties } from "react";

type BarChartWrapperProps = {
	id: string;
	collectData: ChartData;
	children: React.ReactNode;
};

const BarChartWrapper: React.FC<BarChartWrapperProps> = ({
	id,
	collectData,
	children,
}: BarChartWrapperProps) => {
	const { windowMeasuresOnStart } = useGlobalContext();
	return (
		<div
			id={id}
			className={cn(
				"hide-first-x-axis-tick move-recharts-label",
				Object.keys(collectData).length <= 5
					? "h-[calc(var(--bar-chart-wrapper-height) * 0.5)] lg:h-[40vh]"
					: "h-[var(--bar-chart-wrapper-height)] lg:h-[70vh]",
			)}
			style={
				{
					"--bar-chart-wrapper-height": `${(windowMeasuresOnStart?.h ?? 0) * 1.3}px`,
				} as CSSProperties
			}
		>
			{children}
		</div>
	);
};

export default BarChartWrapper;
