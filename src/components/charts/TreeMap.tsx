import {
	ResponsiveContainer,
	Tooltip,
	Treemap as TreeMapRecharts,
} from "recharts";
import branchen from "../../data/branchen.json";
import wordings from "../../data/wordings.json";
import Icon from "../Icons";
import { formatEuroNumber } from "../../utilities";
import React from "react";
import { StickyItemData } from "../../types/global";
import { useGlobalContext } from "../../GlobalContext";

type TreeMapProps = {
	id?: string;
	data: StickyItemData;
};

const TreeMap: React.FC<TreeMapProps> = ({ id, data }) => {
	const { windowMeasuresOnStart } = useGlobalContext();
	if (!Array.isArray(data) || data.length === 0) {
		return null;
	}
	const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);
	const brancheById = new Map(branchen.map((branche) => [branche.id, branche]));
	const collectedData = data
		.map((entry) => {
			const branche = brancheById.get(entry.branche);
			if (!branche) {
				return null;
			}
			return {
				...branche,
				...entry,
				totalValue,
			};
		})
		.filter(Boolean);

	const formatNumber = (num: number): number => {
		if (num < 1000) {
			return num;
		}
		const billions = num / 1000;
		return Math.round(billions * 10) / 10;
	};

	const CustomTreemapNode = (props: any) => {
		const { x, y, width, height, id: nodeID, color } = props;
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

	const CustomTooltip = ({ active, payload, dataID }: any) => {
		if (!active || !payload || !payload.length) {
			return null;
		}
		const payloadData = payload[0].payload;
		const isBeschaeftigtenGraph = dataID === "beschaeftigte";
		return (
			<div className="p-4 select-none bg-foreground">
				<p className="font-bold text-background mb-4">{payloadData.name}</p>
				<div className="flex justify-between items-end">
					<p
						className="text-background"
						dangerouslySetInnerHTML={{
							__html: isBeschaeftigtenGraph
								? wordings.number_on_employees
								: wordings.total,
						}}
					/>
					<p className="font-bold ml-2 text-background">
						{isBeschaeftigtenGraph ? (
							<>
								{formatNumber(payloadData.value)} {wordings.thousand}
							</>
						) : (
							<>{formatEuroNumber(payloadData.value)}</>
						)}
					</p>
				</div>
				<div className="flex justify-between">
					<p className="text-background">{wordings.percentage}</p>
					<p className="font-bold text-background">
						{Math.ceil((100 / payloadData.totalValue) * payloadData.value)}
						{wordings.percentage_sign}
					</p>
				</div>
			</div>
		);
	};

	return (
		<div
			className="h-[calc(var(--window-height-on-start)-var(--header-height))] lg:h-[50dvh]"
			style={
				{
					"--window-height-on-start": `${(windowMeasuresOnStart?.h ?? 0) * 0.95}px`,
				} as React.CSSProperties
			}
		>
			<ResponsiveContainer width="100%" height="100%">
				<TreeMapRecharts
					data={collectedData.sort((a, b) => b.value - a.value)}
					aspectRatio={1}
					dataKey="value"
					fill="none"
					content={<CustomTreemapNode />}
					isAnimationActive={false}
				>
					<Tooltip
						content={(props) => <CustomTooltip {...props} dataID={id} />}
					/>
				</TreeMapRecharts>
			</ResponsiveContainer>
		</div>
	);
};

export default TreeMap;
