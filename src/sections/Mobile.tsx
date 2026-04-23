import data from "../data/data.json";
import React from "react";
import { ChapterKeys, DataObj, StickyItem } from "../types/global";
import Card from "../components/Card";
import Graph from "../components/Graph";
import Welcome from "./Welcome";

type MobileProps = {
	dataKey: ChapterKeys;
};

const Mobile: React.FC<MobileProps> = ({ dataKey }) => {
	const chapters = data as DataObj;
	const items = chapters[dataKey];

	return (
		<section id={dataKey}>
			{dataKey === "einleitung" && <Welcome />}
			{items.map((item: StickyItem, index: number) => (
				<div
					key={index}
					className="pt-[calc(var(--header-height)+50px)] flex flex-col gap-[10vh]"
				>
					<Card key={item.id} dataKey={dataKey} item={item} />
					<Graph data={items[index] as StickyItem} />
				</div>
			))}
		</section>
	);
};

export default Mobile;
