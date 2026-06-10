import React from "react";
import { TooltipProps } from "recharts";
import type {
	ValueType,
	NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatNumber } from "@/utilities";
import wordings from "@/data/wordings.json";

type ToolTipProps = Partial<TooltipProps<ValueType, NameType>> & {
	payload?: any;
	chart_unit?: string;
	objectKeys: string[];
	id: string;
};

const ToolTip: React.FC<ToolTipProps> = ({
	active,
	payload,
	chart_unit = "",
	objectKeys,
	id,
}) => {
	if (!active || !payload || !payload.length) {
		return null;
	}
	const payloadData = payload[0].payload;
	const excludeKeyFromToolTip = [
		"umsatz_nachahmer_innovationen",
		"differenz_intensitaet",
		"total",
	];
	if (
		id === "inno_intensitaet" ||
		id === "protective_measures_intellectual_property"
	) {
		excludeKeyFromToolTip.push("insgesamt");
	}
	return (
		<div className="p-4 select-none bg-foreground max-lg:max-w-[75vw]">
			<p className="font-bold text-background mb-4">{payloadData.name}</p>
			<>
				{objectKeys
					.filter(
						(objectKey: string) => !excludeKeyFromToolTip.includes(objectKey),
					)
					.sort((a: string, b: string) => {
						if (a === "fue_intensitaet") {
							return -1;
						}
						if (b === "fue_intensitaet") {
							return 1;
						}
						return 0;
					})
					.map((key: string) => (
						<div className="flex items-start gap-6" key={key}>
							{wordings[key as keyof typeof wordings] && (
								<p className="text-background flex-1 min-w-0">
									{wordings[key as keyof typeof wordings]}:
								</p>
							)}
							<p className="font-bold ml-2 text-background ml-auto shrink-0">
								{formatNumber(payloadData[key])}
								{chart_unit}
							</p>
						</div>
					))}
			</>
		</div>
	);
};

export default ToolTip;
