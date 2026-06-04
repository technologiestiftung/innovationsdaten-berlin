import React, { CSSProperties } from "react";
import { TooltipProps } from "recharts";
import type {
	ValueType,
	NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatNumber } from "@/utilities";
import wordings from "@/data/wordings.json";

type ToolTipProps = Partial<TooltipProps<ValueType, NameType>> & {
	payload?: any;
	chart_type: string;
	chart_unit?: string;
	objectKeys: string[];
	activeFilter?: string | null;
	id: string;
};

const ToolTip: React.FC<ToolTipProps> = ({
	active,
	payload,
	chart_type,
	chart_unit = "",
	objectKeys,
	activeFilter,
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
		<div
			className="p-4 select-none bg-foreground max-lg:max-w-[var(--max-width)]"
			style={{ "--max-width": window.innerWidth * 0.75 } as CSSProperties}
		>
			<p className="font-bold text-background mb-4">{payloadData.name}</p>
			{!chart_type.includes("filter_keys") ? (
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
							<div className="flex justify-between gap-6" key={key}>
								{wordings[key as keyof typeof wordings] && (
									<p className="text-background">
										{wordings[key as keyof typeof wordings]}:
									</p>
								)}
								<p className="font-bold ml-2 text-background">
									{formatNumber(payloadData[key])}
									{chart_unit}
								</p>
							</div>
						))}
				</>
			) : (
				<>
					<div className="flex justify-between gap-6">
						<p className="first-letter:capitalize text-background">
							{activeFilter}
						</p>
						<p className="font-bold ml-2 text-background">
							{formatNumber(payloadData[activeFilter || ""])}
							{chart_unit}
						</p>
					</div>
				</>
			)}
		</div>
	);
};

export default ToolTip;
