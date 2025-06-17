import React, { useEffect, useState } from "react";
import { StickyItem } from "../types/global";
import BranchenList from "./charts/BranchenList";
import TreeMap from "./charts/TreeMap";
import AreaChart from "./charts/AreaChart";
import BarChart from "./charts/BarChart";
import { useGlobalContext } from "../GlobalContext";
import BigFact from "./charts/BigFact";
import MatrixChart from "./charts/MatrixChart";
import mobilematrix from "../data/mobile-matrix.json";

type GraphProps = {
	data: StickyItem;
};

const Graph: React.FC<GraphProps> = ({ data }) => {
	const { region, isMobile } = useGlobalContext();
	const [toggleData, setToggleData] = useState<string | null>(null);

	useEffect(() => {
		if (data?.togglesBetween) {
			setToggleData(data?.togglesBetween[0]);
		}
	}, [data?.togglesBetween]);

	if (!data) {
		return null;
	}
	const {
		id,
		chart_type,
		chart_unit,
		has_tooltip,
		facts,
		bar_chart_unit_breakpoint,
		togglesBetween,
		sortsAfter,
		sortsAfterOnStart,
		max_value,
		data: content,
	} = data;

	const hasRegionToggle = "ber" in (content || {});
	const matrixData = (mobilematrix as Record<string, Record<string, any>>)[
		id
	]?.[region];

	const hasMultipleBreakpoints =
		!!bar_chart_unit_breakpoint &&
		typeof bar_chart_unit_breakpoint !== "number";

	return (
		<>
			{/* BIG FACT */}
			{chart_type === "big_fact" && <BigFact facts={facts} />}
			{/* BRANCHEN LISTE */}
			{id === "branchen_list" && <BranchenList />}
			{/* TREEMAP */}
			{chart_type === "tree_map" && <TreeMap id={id} data={content} />}
			{/* AREA CHART */}
			{chart_type === "area_chart" && (
				<div className="hide-first-y-axis-tick move-last-x-axis-tick move-first-x-axis-tick move-first-y-axis-tick">
					{toggleData ? (
						<AreaChart
							id={id}
							data={(content as Record<string, any>)[toggleData]}
							toggleData={toggleData}
							setToggleData={setToggleData}
							togglesBetween={togglesBetween}
						/>
					) : (
						<AreaChart
							id={id}
							data={(content as Record<string, any>)[region]}
						/>
					)}
				</div>
			)}
			{/* BAR CHART */}
			{chart_type?.includes("bar_chart") && (
				<BarChart
					id={id}
					chart_type={chart_type}
					chart_unit={chart_unit}
					has_tooltip={has_tooltip}
					max_value={max_value}
					bar_chart_unit_breakpoint={
						hasMultipleBreakpoints
							? (bar_chart_unit_breakpoint as Record<string, any>)[region]
							: bar_chart_unit_breakpoint
					}
					hasRegionToggle={hasRegionToggle}
					sortsAfter={sortsAfter}
					sortsAfterOnStart={sortsAfterOnStart}
					data={
						hasRegionToggle ? (content as Record<string, any>)[region] : content
					}
				/>
			)}
			{/* MATRIX CHART */}
			{chart_type === "matrix" && (
				<MatrixChart
					id={id}
					data={
						isMobile ? matrixData : (content as Record<string, any>)[region]
					}
				/>
			)}
		</>
	);
};

export default Graph;
