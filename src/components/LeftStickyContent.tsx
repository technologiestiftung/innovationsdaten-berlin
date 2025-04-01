import React, { useEffect, useState } from "react";
import { StickyItem } from "../types/global";
import BigFact from "./BigFact";
import BranchenList from "./BranchenList";
import TreeMap from "./TreeMap";
import AreaChart from "./AreaChart";
import BarChart from "./BarChart";
import Overview from "./Overview";
import { useGlobalContext } from "../GlobalContext";
import BigFactComparison from "./BigFactComparison";

type LeftStickyContentProps = {
	data: StickyItem;
};

const LeftStickyContent: React.FC<LeftStickyContentProps> = ({ data }) => {
	const { region } = useGlobalContext();
	const [toggleData, setToggleData] = useState<string | null>(null);

	useEffect(() => {
		if (data?.allToggles) {
			setToggleData(data?.allToggles[0]);
		}
	}, [data?.allToggles]);

	if (!data) {
		return null;
	}
	const {
		id,
		fact,
		facts,
		unit,
		data: content,
		bar_chart_type,
		bar_chart_unit,
		bar_chart_unit_breakpoint,
		allToggles,
	} = data;
	const hasToggle = "ber" in (content || {});
	const hasMultipleBreakpoints =
		!!bar_chart_unit_breakpoint &&
		typeof bar_chart_unit_breakpoint !== "number";

	return (
		<>
			{id === "welcome" && <Overview />}
			{fact && <BigFact fact={fact} unit={unit} />}
			{facts && <BigFactComparison facts={facts} />}
			{id === "branchen-list" && <BranchenList />}
			{(id === "umsatz" || id === "beschaeftigte") && (
				<TreeMap id={id} unit={unit} data={content} />
			)}
			{(id === "sektoren" || id === "growth") && content !== undefined && (
				<div className="hide-first-y-axis-tick">
					<AreaChart id={id} data={(content as Record<string, any>)[region]} />
				</div>
			)}
			{id === "berlin_is_ahead" && content !== undefined && toggleData && (
				<div className="hide-first-y-axis-tick">
					<AreaChart
						id={id}
						data={(content as Record<string, any>)[toggleData]}
						toggleData={toggleData}
						setToggleData={setToggleData}
						allToggles={allToggles}
					/>
				</div>
			)}
			{bar_chart_type && (
				<BarChart
					id={id}
					data={hasToggle ? (content as Record<string, any>)[region] : content}
					bar_chart_type={bar_chart_type}
					bar_chart_unit={bar_chart_unit}
					bar_chart_unit_breakpoint={
						hasMultipleBreakpoints
							? (bar_chart_unit_breakpoint as Record<string, any>)[region]
							: bar_chart_unit_breakpoint
					}
					hasToggle={hasToggle}
				/>
			)}
		</>
	);
};

export default LeftStickyContent;
