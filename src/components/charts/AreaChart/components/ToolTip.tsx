import React, { CSSProperties } from "react";
import { Tooltip } from "recharts";
import { cn, formatEuroNumber, roundToTwoDecimals } from "@/utilities";
import wordings from "@/data/wordings.json";
import branchen from "@/data/branchen.json";
import colors from "@/data/colors.json";
import sektoren from "@/data/sektoren.json";
import { ChartTypes } from "@/types/global";

type ToolTipProps = {
	chart_type: ChartTypes;
	activeFilters?: string[] | null;
};

const ToolTip: React.FC<ToolTipProps> = ({ chart_type, activeFilters }) => {
	const findTitle = (dataKey: string) => {
		if (dataKey === "dienstleistungen") {
			return "Dienstleistungen";
		}
		if (dataKey === "industrie") {
			return "Industrie";
		}
		const branche = branchen.find((findBranche) => findBranche.id === dataKey);
		return branche?.name || dataKey.toUpperCase();
	};
	const getBGColor = (dataKey: string) => {
		if (sektoren.some((someSektor) => someSektor.id === dataKey)) {
			const getSektor = sektoren.find(
				(findSektor) => findSektor.id === dataKey,
			);
			return getSektor?.color;
		}
		if (branchen.some((branche) => branche.id === dataKey)) {
			const findBranche = branchen.find((branche) => branche.id === dataKey);
			return findBranche?.color;
		}
		if (dataKey === "ber" || dataKey === "de") {
			return dataKey === "ber" ? colors.cyan_light : colors.green_light;
		}
		return colors.blue;
	};

	return (
		<Tooltip
			content={(props) => {
				const { active, payload } = props;
				if (!active || !payload || !payload.length) {
					return null;
				}
				const payloadData = payload[0].payload;
				const DataKeys = Object.keys(payloadData).filter(
					(key) => key !== "year",
				);

				const isToggleChart = chart_type?.includes("toggle");

				const shouldShowKey = (dataKey: string) =>
					isToggleChart ||
					activeFilters?.includes(dataKey) ||
					dataKey === "dienstleistungen" ||
					dataKey === "industrie";

				const getLabel = (dataKey: string) => {
					if (isToggleChart) {
						return dataKey === "ber" ? "Berlin" : "Deutschland";
					}
					return findTitle(dataKey);
				};

				const getValue = (dataKey: string) => {
					if (isToggleChart) {
						return `${roundToTwoDecimals(payloadData[dataKey])}${wordings.percentage_sign}`;
					}
					return formatEuroNumber(payloadData[dataKey]);
				};
				return (
					<div className="p-4 select-none bg-foreground">
						<p className="font-bold mb-4 text-background">
							{payloadData?.year}
						</p>
						{DataKeys.filter(shouldShowKey).map((dataKey) => (
							<div key={dataKey} className="flex justify-between gap-6">
								<div className="flex items-center">
									<span
										className="mr-2 inline-block h-3 w-3 bg-[var(--bg)]"
										style={
											{
												"--bg": getBGColor(dataKey),
											} as CSSProperties
										}
									/>
									<p
										className={cn(
											"text-background",
											!isToggleChart && "max-w-[40vw] truncate",
										)}
									>
										{getLabel(dataKey)}:
									</p>
								</div>
								<p className="ml-2 font-bold text-background">
									{getValue(dataKey)}
								</p>
							</div>
						))}
					</div>
				);
			}}
		/>
	);
};

export default ToolTip;
