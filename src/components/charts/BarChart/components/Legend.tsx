import React, { CSSProperties } from "react";
import wordings from "@/data/wordings.json";
import { Legend as RechartsLegend } from "recharts";

type LegendProps = {
	chart_type: string;
};

type LegendEntry = {
	value?: string;
	color?: string;
};

const Legend: React.FC<LegendProps> = ({ chart_type }: LegendProps) => {
	if (!chart_type.includes("stacked")) {
		return null;
	}
	return (
		<RechartsLegend
			content={(props) => {
				const { payload } = props;
				if (!payload || !payload.length) {
					return null;
				}
				return (
					<ul className="flex flex-wrap list-none p-0 mt-10">
						{payload.map((entry: LegendEntry, index: number) => (
							<li key={`item-${index}`} className="flex items-center mr-4">
								<div
									className="inline-block w-3 h-3 mr-2 bg-[var(--bg)]"
									style={{ "--bg": entry.color } as CSSProperties}
								/>
								<p className="text-[12px] leading-[14.4px]">
									{wordings[entry.value as keyof typeof wordings] ||
										entry.value}
								</p>
							</li>
						))}
					</ul>
				);
			}}
		/>
	);
};

export default Legend;
