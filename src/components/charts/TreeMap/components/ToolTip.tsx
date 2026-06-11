import React from "react";
import wordings from "@/data/wordings.json";
import { formatEuroNumber } from "@/utilities";
import { Tooltip as RechartsTooltip } from "recharts";

type TooltipProps = {
	dataID: string;
};

const Tooltip: React.FC<TooltipProps> = ({ dataID }: TooltipProps) => {
	const formatNumber = (num: number): number => {
		if (num < 1000) {
			return num;
		}
		const billions = num / 1000;
		return Math.round(billions * 10) / 10;
	};
	return (
		<RechartsTooltip
			content={(props) => {
				const { active, payload } = props;
				if (!active || !payload || !payload.length) {
					return null;
				}
				const payloadData = payload[0].payload;
				const isBeschaeftigtenGraph = dataID === "beschaeftigte";
				return (
					<div className="p-4 select-none bg-foreground">
						<p className="font-bold text-background mb-4">{payloadData.name}</p>
						<div className="flex justify-between items-end">
							<p
								className="text-background"
								dangerouslySetInnerHTML={{
									__html: isBeschaeftigtenGraph
										? wordings.number_on_employees
										: wordings.total,
								}}
							/>
							<p className="font-bold ml-2 text-background">
								{isBeschaeftigtenGraph ? (
									<>
										{formatNumber(payloadData.value)} {wordings.thousand}
									</>
								) : (
									<>{formatEuroNumber(payloadData.value)}</>
								)}
							</p>
						</div>
						<div className="flex justify-between">
							<p className="text-background">{wordings.percentage}</p>
							<p className="font-bold text-background">
								{Math.ceil((100 / payloadData.totalValue) * payloadData.value)}
								{wordings.percentage_sign}
							</p>
						</div>
					</div>
				);
			}}
		/>
	);
};

export default Tooltip;
