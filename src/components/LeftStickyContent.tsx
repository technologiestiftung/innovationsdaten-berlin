import React from "react";
import { StickyItem } from "../types/global";
import BigFact from "./BigFact";
import BranchenList from "./BranchenList";
import TreeMap from "./TreeMap";
import AreaChart from "./AreaChart";

type LeftStickyContentProps = {
	data: StickyItem;
};

const LeftStickyContent: React.FC<LeftStickyContentProps> = ({ data }) => {
	if (!data) {
		return null;
	}
	const { id, fact, unit, data: content } = data;
	return (
		<>
			{fact && <BigFact fact={fact} unit={unit} />}
			{id === "branchen-list" && <BranchenList />}
			{(id === "umsatz" || id === "beschaeftigte") && (
				<TreeMap id={id} unit={unit} data={content} />
			)}
			{(id === "sektoren" || id === "growth") && (
				<AreaChart id={id} data={content} />
			)}
		</>
	);
};

export default LeftStickyContent;
