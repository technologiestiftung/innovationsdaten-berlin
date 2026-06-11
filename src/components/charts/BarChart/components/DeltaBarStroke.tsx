import React from "react";
import { RectangleProps } from "recharts";

const DeltaBarStroke: React.FC<RectangleProps & { payload?: any }> = (
	props,
) => {
	const { x, y, width, height, payload } = props;
	const fill = payload?.positiveDelta
		? "url(#green-stripes)"
		: "url(#red-stripes)";

	if (!height || !width) {
		return null;
	}

	return (
		<rect
			x={x}
			y={y}
			width={width}
			height={payload?.positiveDelta ? height : height - 2}
			fill={fill}
			transform={
				payload?.positiveDelta
					? `translate(1, 0)`
					: `translate(-${width + 1}, 1)`
			}
		/>
	);
};

export default DeltaBarStroke;
