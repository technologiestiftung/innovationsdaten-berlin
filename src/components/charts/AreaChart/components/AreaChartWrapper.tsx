/* eslint-disable no-nested-ternary */

import React, { CSSProperties } from "react";
import { cn } from "@/utilities";

type AreaChartWrapperProps = {
	chart_type: string;
	hide_toggle?: boolean;
	windowMeasuresOnStart?: {
		w: number;
		h: number;
	} | null;
	children: React.ReactNode;
};

const AreaChartWrapper: React.FC<AreaChartWrapperProps> = ({
	chart_type,
	hide_toggle,
	windowMeasuresOnStart,
	children,
}: AreaChartWrapperProps) => {
	const getNumberOfOptions = () => {
		const isBranchen = chart_type?.includes("branchen");
		const hasToggle = chart_type?.includes("toggle");

		if (!hasToggle && isBranchen) {
			return 2;
		}
		if (!hide_toggle) {
			return 1;
		}
		return 0;
	};
	const numberOfOptionsShown = getNumberOfOptions();
	return (
		<div
			className={cn(
				!numberOfOptionsShown
					? "h-[calc(var(--window-height-on-start)-var(--header-height))]"
					: numberOfOptionsShown === 1
						? "h-[calc(var(--window-height-on-start)-var(--header-height)-44px-0.5rem)]"
						: "h-[calc(var(--window-height-on-start)-var(--header-height)-88px-1rem)]",
				"lg:h-[60vh]",
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

export default AreaChartWrapper;
