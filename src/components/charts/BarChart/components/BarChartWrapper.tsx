/* eslint-disable no-nested-ternary */

import { useGlobalContext } from "@/GlobalContext";
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
	const { windowMeasuresOnStart } = useGlobalContext();
	return (
		<div
			id={id}
			className={cn(
				"hide-first-x-axis-tick move-recharts-label",
				chart_type === "bar_chart_filter_keys"
					? Object.keys(collectData).length <= 5
						? "h-[40vh]"
						: "h-[calc(var(--window-height-on-start)-var(--header-height))] md:h-[70vh]"
					: "h-[calc(var(--window-height-on-start)-var(--header-height))] lg:h-[70vh]",
			)}
			style={
				{
					"--window-height-on-start": `${(windowMeasuresOnStart?.h ?? 0) * 0.95}px`,
				} as CSSProperties
			}
		>
			{children}
		</div>
	);
};

export default BarChartWrapper;
