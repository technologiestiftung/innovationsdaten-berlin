import {
	ResponsiveContainer,
	Tooltip,
	Treemap as TreeMapRecharts,
} from "recharts";
import branchen from "../../data/branchen.json";
import colors from "../../data/colors.json";
import Icon from "../Icons";
import { useGlobalContext } from "../../GlobalContext";
import { formatEuroNumber } from "../../utilities";
import React from "react";
import { StickyItemData } from "../../types/global";

type TreeMapProps = {
	id?: string;
	data: StickyItemData;
};

const TreeMap: React.FC<TreeMapProps> = ({ id, data }) => {
	const { theme, fontSize } = useGlobalContext();

	if (!data || !Array.isArray(data)) {
		return null;
	}

	let totalValue = 0;
	data.forEach((entry: any) => (totalValue += entry.value));
	const collectData = data.map((entry: any) => {
		const branche = branchen.find(
			(findBranche) => findBranche.id === entry.branche,
		);
		if (branche) {
			const returnData = {
				...branche,
				...entry,
				totalValue,
			};
			return returnData;
		}
		return null;
	});

	const formatNumber = (num: number): number => {
		if (num < 1000) {
			return num;
		}
		const billions = num / 1000;
		return Math.round(billions * 10) / 10;
	};

	const CustomTreemapNode = (props: any) => {
		const { x, y, width, height, id: nodeID, color } = props;
		const iconSize = fontSize * 1.5;
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
					stroke={theme === "dark" ? colors.white : colors.blue}
					strokeWidth={2}
				/>
				{width > iconSize + 10 && height > iconSize + 10 && (
					<foreignObject x={iconX} y={iconY} width={iconSize} height={iconSize}>
						<Icon id={nodeID} setColor={colors.white} size={iconSize} />
					</foreignObject>
				)}
			</g>
		);
	};

	const CustomTooltip = ({ active, payload, dataID }: any) => {
		if (!active || !payload || !payload.length) {
			return null;
		}
		const payloadData = payload[0].payload;
		return (
			<div
				className="p-4 select-none"
				style={{
					backgroundColor: theme === "dark" ? colors.white : colors.blue,
				}}
			>
				<p
					className="bold"
					style={{
						color: theme === "dark" ? colors.dark : colors.white,
						marginBottom: fontSize,
					}}
				>
					{payloadData.name}
				</p>
				<div className="flex justify-between items-end">
					<p
						style={{ color: theme === "dark" ? colors.dark : colors.white }}
						// @refactor
						dangerouslySetInnerHTML={{
							__html:
								dataID === "beschaeftigte"
									? "Anzahl der<br/>Beschäftigten:"
									: "Gesamt:",
						}}
					/>
					{dataID === "beschaeftigte" ? (
						<p
							className="bold ml-2"
							style={{ color: theme === "dark" ? colors.dark : colors.white }}
						>
							{/* Value Display */}
							{formatNumber(payloadData.value)} Tsd.
						</p>
					) : (
						<p
							className="bold ml-2"
							style={{ color: theme === "dark" ? colors.dark : colors.white }}
						>
							{/* Value Display */}
							{formatEuroNumber(payloadData.value)}
						</p>
					)}
				</div>
				<div className="flex justify-between">
					<p style={{ color: theme === "dark" ? colors.dark : colors.white }}>
						Anteil:
					</p>
					<p
						className="bold"
						style={{ color: theme === "dark" ? colors.dark : colors.white }}
					>
						{Math.ceil((100 / payloadData.totalValue) * payloadData.value)}%
					</p>
				</div>
			</div>
		);
	};

	return (
		<>
			<div
				style={{
					border:
						theme === "dark"
							? `1px ${colors.white} solid`
							: `1px ${colors.blue} solid`,
					position: "relative",
				}}
			>
				<ResponsiveContainer width="100%" height={window.innerHeight * 0.5}>
					<TreeMapRecharts
						data={collectData}
						aspectRatio={1}
						dataKey="value"
						fill="none"
						content={<CustomTreemapNode />}
						animationDuration={300}
					>
						<Tooltip
							content={(props) => <CustomTooltip {...props} dataID={id} />}
						/>
					</TreeMapRecharts>
				</ResponsiveContainer>
			</div>
		</>
	);
};

export default TreeMap;
