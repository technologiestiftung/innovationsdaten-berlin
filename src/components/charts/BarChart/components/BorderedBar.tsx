import React from "react";
import { RectangleProps } from "recharts";

const BorderedBar: React.FC<RectangleProps & { payload?: any }> = (props) => {
	const { x, y, width, height } = props;
	return (
		<rect
			x={x}
			y={y}
			width={width}
			height={height}
			stroke="var(--foreground)"
			fill="none"
			strokeWidth={2}
		/>
	);
};

export default BorderedBar;
