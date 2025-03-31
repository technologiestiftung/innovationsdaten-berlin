import React from "react";
import { StickyItem } from "../types/global";
import BigFact from "./BigFact";
import BranchenList from "./BranchenList";
import TreeMap from "./TreeMap";
import AreaChart from "./AreaChart";
import BarChart from "./BarChart";
import Overview from "./Overview";
import { useGlobalContext } from "../GlobalContext";

type LeftStickyContentProps = {
	data: StickyItem;
};

const LeftStickyContent: React.FC<LeftStickyContentProps> = ({ data }) => {
	const { region } = useGlobalContext();
	if (!data) {
		return null;
	}
	const {
		id,
		fact,
		unit,
		data: content,
		bar_chart_type,
		bar_chart_unit,
		bar_chart_unit_breakpoint,
	} = data;
	const barChartIDs = [
		"inno-ausgaben-2022",
		"inno-ausgaben-2023",
		"inno-intensitaet",
	];
	return (
		<>
			{id === "welcome" && <Overview />}
			{fact && <BigFact fact={fact} unit={unit} />}
			{id === "branchen-list" && <BranchenList />}
			{(id === "umsatz" || id === "beschaeftigte") && (
				<TreeMap id={id} unit={unit} data={content} />
			)}
			{(id === "sektoren" || id === "growth") && content !== undefined && (
				<div className="hide-first-y-axis-tick">
					<AreaChart id={id} data={(content as Record<string, any>)[region]} />
				</div>
			)}
			{barChartIDs.includes(id) && (
				<BarChart
					data={content}
					bar_chart_type={bar_chart_type}
					bar_chart_unit={bar_chart_unit}
					bar_chart_unit_breakpoint={bar_chart_unit_breakpoint}
				/>
			)}
		</>
	);
};

export default LeftStickyContent;
