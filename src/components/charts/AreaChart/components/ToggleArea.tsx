import React from "react";
import { Area } from "recharts";
import colors from "@/data/colors.json";
import { useGlobalContext } from "@/GlobalContext";

type ToggleAreaProps = {
	chart_type: string;
};

const ToggleArea: React.FC<ToggleAreaProps> = ({
	chart_type,
}: ToggleAreaProps) => {
	const { animationDuration } = useGlobalContext();
	if (!chart_type?.includes("toggle")) {
		return null;
	}
	return (
		<>
			<Area
				type="linear"
				dataKey="ber"
				fill="none"
				stroke={colors.cyan_light}
				strokeWidth={3}
				animationDuration={animationDuration}
			/>
			<Area
				type="linear"
				dataKey="de"
				fill="none"
				stroke={colors.green_light}
				strokeWidth={3}
				animationDuration={animationDuration}
			/>
		</>
	);
};

export default ToggleArea;
