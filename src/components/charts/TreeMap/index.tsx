import { ResponsiveContainer, Treemap as TreeMapRecharts } from "recharts";
import branchen from "@/data/branchen.json";
import React, { CSSProperties } from "react";
import { ChapterItem, TreemapDataType } from "@/types/global";
import { useGlobalContext } from "@/GlobalContext";
import Tooltip from "./components/ToolTip";
import Content from "./components/Content";

const TreeMap: React.FC<ChapterItem> = ({ id, chartData }) => {
	const { windowMeasuresOnStart } = useGlobalContext();
	if (!Array.isArray(chartData) || chartData.length === 0) {
		return null;
	}
	const totalValue = chartData.reduce((sum, entry) => sum + entry.value, 0);
	const brancheById = new Map(branchen.map((branche) => [branche.id, branche]));
	const collectedData = chartData
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
		.filter(Boolean)
		.sort((a, b) => (b?.value ?? 0) - (a?.value ?? 0));

	return (
		<div
			className="h-[calc(var(--window-height-on-start)-var(--header-height))] lg:h-[50dvh]"
			style={
				{
					"--window-height-on-start": `${(windowMeasuresOnStart?.h ?? 0) * 0.95}px`,
				} as CSSProperties
			}
		>
			<ResponsiveContainer width="100%" height="100%">
				<TreeMapRecharts
					data={collectedData as TreemapDataType}
					aspectRatio={1}
					dataKey="value"
					fill="none"
					content={(props) => <Content {...props} />}
					isAnimationActive={false}
				>
					<Tooltip dataID={id ?? ""} />
				</TreeMapRecharts>
			</ResponsiveContainer>
		</div>
	);
};

export default TreeMap;
