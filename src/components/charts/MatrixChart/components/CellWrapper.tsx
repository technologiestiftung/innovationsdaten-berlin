import React, { useEffect, useState } from "react";
import { MatrixData } from "@/types/global";
import { useGlobalContext } from "@/GlobalContext";
import { getMinMax } from "@/components/charts/MatrixChart/utils";
import Cell from "./Cell";

type CellWrapperProps = {
	data: MatrixData[];
	yLabels: string[];
};

const CellWrapper: React.FC<CellWrapperProps> = ({
	data,
	yLabels,
}: CellWrapperProps) => {
	const { isMobile } = useGlobalContext();
	const [maxValue, setMaxValue] = useState(0);
	const [minValue, setMinValue] = useState(0);
	useEffect(() => {
		if (data) {
			const { min, max } = getMinMax(data);
			setMinValue(min);
			setMaxValue(max);
		}
	}, [data]);
	return (
		<>
			{data.map(({ x, y, value }) => (
				<Cell
					key={`${x}-${y}`}
					x={isMobile ? y : x}
					y={isMobile ? x : y}
					value={value}
					minValue={minValue}
					maxValue={maxValue}
					yLabels={yLabels}
				/>
			))}
		</>
	);
};

export default CellWrapper;
