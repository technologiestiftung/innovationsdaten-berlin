import React, { useEffect, useState } from "react";
import { StickyItem } from "../types/global";
import BranchenList from "./charts/BranchenList";
import TreeMap from "./charts/TreeMap";
import AreaChart from "./charts/AreaChart";
import BarChart from "./charts/BarChart";
import { useGlobalContext } from "../GlobalContext";
import BigFact from "./charts/BigFact";
import MatrixChart from "./charts/MatrixChart";

type LeftStickyContentProps = {
	data: StickyItem;
};

const LeftStickyContent: React.FC<LeftStickyContentProps> = ({ data }) => {
	const { region } = useGlobalContext();
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
		facts,
		bar_chart_unit_breakpoint,
		togglesBetween,
		sortsAfter,
		data: content,
	} = data;

	const hasRegionToggle = "ber" in (content || {});

	const hasMultipleBreakpoints =
		!!bar_chart_unit_breakpoint &&
		typeof bar_chart_unit_breakpoint !== "number";

	return (
		<>
			{/* BIG FACT */}
			{chart_type === "big_fact" && <BigFact facts={facts} />}
			{/* BRANCHEN LISTE */}
			{id === "branchen-list" && <BranchenList />}
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
					bar_chart_unit_breakpoint={
						hasMultipleBreakpoints
							? (bar_chart_unit_breakpoint as Record<string, any>)[region]
							: bar_chart_unit_breakpoint
					}
					hasRegionToggle={hasRegionToggle}
					sortsAfter={sortsAfter}
					data={
						hasRegionToggle ? (content as Record<string, any>)[region] : content
					}
				/>
			)}
			{/* MATRIX CHART */}
			{chart_type === "matrix" && (
				<MatrixChart
					data={
						hasRegionToggle ? (content as Record<string, any>)[region] : content
					}
				/>
			)}
		</>
	);
};

export default LeftStickyContent;
