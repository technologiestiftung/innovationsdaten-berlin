import React from "react";
import Icon from "@/components/Icons";

type ContentProps = {
	x: number;
	y: number;
	width: number;
	height: number;
	id?: string;
	color?: string;
};

const Content: React.FC<ContentProps> = ({
	x,
	y,
	width,
	height,
	id: nodeID,
	color,
}) => {
	const iconSize = 24;
	const iconX = x + (width - iconSize) / 2;
	const iconY = y + (height - iconSize) / 2;
	return (
		<g className="cursor-pointer">
			<rect
				x={x}
				y={y}
				width={width}
				height={height}
				fill={color}
				strokeWidth={2}
				className="stroke-[var(--foreground)]"
			/>
			{width > iconSize + 10 && height > iconSize + 10 && (
				<foreignObject x={iconX} y={iconY} width={iconSize} height={iconSize}>
					<Icon id={nodeID} className="text-white size-6" />
				</foreignObject>
			)}
		</g>
	);
};

export default Content;
