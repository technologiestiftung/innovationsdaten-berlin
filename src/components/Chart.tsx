import React from "react";
import { BigFactType, ChapterItem } from "@/types/global";
import BranchenList from "./charts/BranchenList";
import AreaChart from "./charts/AreaChart";
import BigFact from "./charts/BigFact";
import BarChart from "./charts/BarChart";
import MatrixChart from "./charts/MatrixChart";
import TreeMap from "./charts/TreeMap";

type ChartProps = {
	chapter: ChapterItem;
};

const Chart: React.FC<ChartProps> = ({ chapter }) => {
	if (!chapter) {
		return null;
	}
	const { id, chart_type, bigFacts } = chapter;

	return (
		<>
			{/* BIG FACT */}
			{chart_type === "big_fact" && (
				<BigFact bigFacts={bigFacts as BigFactType[]} />
			)}
			{/* BRANCHEN LISTE */}
			{id === "branchen_list" && <BranchenList />}
			{/* TREEMAP */}
			{chart_type === "tree_map" && <TreeMap {...chapter} />}
			{/* AREA CHART */}
			{chart_type?.includes("area_chart") && <AreaChart {...chapter} />}
			{/* BAR CHART */}
			{chart_type?.includes("bar_chart") && <BarChart {...chapter} />}
			{/* MATRIX CHART */}
			{chart_type === "matrix" && <MatrixChart {...chapter} />}
		</>
	);
};

export default Chart;
