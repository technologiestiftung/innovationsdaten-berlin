import React from "react";
import branchen from "@/data/branchen.json";
import Icon from "@/components/Icons";

type CustomMobileTickProps = {
	y?: number;
	payload?: {
		value: string;
	};
};

const CustomMobileTick: React.FC<CustomMobileTickProps> = ({
	y = 0,
	payload,
}) => {
	if (!payload?.value) {
		return null;
	}
	const findBrancheInTick = branchen.find(
		(findBranche) => findBranche.name === payload.value,
	);
	return (
		<g transform={`translate(${0}, ${y - 13})`}>
			<Icon id={findBrancheInTick?.id} className="size-6 text-foreground" />
		</g>
	);
};

export default CustomMobileTick;
