import React from "react";
import { RectangleProps } from "recharts";

const FilledBar: React.FC<RectangleProps & { payload?: any }> = (props) => {
	const { x, y, width, height, payload } = props;
	return (
		<rect x={x} y={y} width={width} height={height} fill={payload?.color} />
	);
};

export default FilledBar;
