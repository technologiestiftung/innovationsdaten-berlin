import { useGlobalContext } from "@/GlobalContext";
import { ChartData } from "@/types/global";
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
	const { isMobile } = useGlobalContext();
	let heightOfSingleBar = 40;

	if (chart_type.includes("filter_keys") && !chart_type.includes("branchen")) {
		heightOfSingleBar = isMobile ? 95 : 55;
	} else {
		heightOfSingleBar = isMobile ? 60 : 40;
	}

	return (
		<div
			id={id}
			className="hide-first-x-axis-tick move-recharts-label h-[var(--bar-chart-wrapper-height)]"
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
