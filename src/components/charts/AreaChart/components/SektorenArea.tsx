import React from "react";
import sektoren from "@/data/sektoren.json";
import { Area } from "recharts";
import { useGlobalContext } from "@/GlobalContext";

type SektorenAreaProps = {
	chart_type: string;
};

const SektorenArea: React.FC<SektorenAreaProps> = ({
	chart_type,
}: SektorenAreaProps) => {
	const { animationDuration } = useGlobalContext();
	if (!chart_type?.includes("sektoren")) {
		return null;
	}
	return (
		<>
			{sektoren.map((sektor) => (
				<Area
					key={sektor.id}
					type="linear"
					dataKey={sektor.id}
					stroke="var(--foreground)"
					strokeWidth={3}
					fill={sektor.color}
					stackId="1"
					fillOpacity={1}
					animationDuration={animationDuration}
				/>
			))}
		</>
	);
};

export default SektorenArea;
