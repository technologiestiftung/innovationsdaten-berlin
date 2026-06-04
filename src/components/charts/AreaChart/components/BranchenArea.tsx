import React from "react";
import branchen from "@/data/branchen.json";
import { Area } from "recharts";
import { useGlobalContext } from "@/GlobalContext";

type BranchenAreaProps = {
	chart_type: string;
	activeFilters?: string[] | null;
};

const BranchenArea: React.FC<BranchenAreaProps> = ({
	chart_type,
	activeFilters,
}: BranchenAreaProps) => {
	const getStrokeOrFill = (brancheID: string, color: string | null) => {
		if (activeFilters && activeFilters.indexOf(brancheID) > -1) {
			if (color) {
				return color;
			}
			return "var(--foreground)";
		}
		return "color-mix(in srgb, var(--foreground) 20%, transparent)";
	};
	const { animationDuration } = useGlobalContext();
	if (!chart_type?.includes("branchen")) {
		return null;
	}
	return (
		<>
			{branchen
				.filter((branche) =>
					activeFilters ? activeFilters?.indexOf(branche.id) > -1 : false,
				)
				.map((branche) => (
					<Area
						key={branche.id}
						type="linear"
						dataKey={branche.id}
						stroke={getStrokeOrFill(branche.id, null)}
						strokeWidth={3}
						fill={getStrokeOrFill(branche.id, branche.color)}
						stackId="1"
						fillOpacity={1}
						animationDuration={animationDuration}
					/>
				))}
		</>
	);
};

export default BranchenArea;
