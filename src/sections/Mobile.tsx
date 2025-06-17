import data from "../data/data.json";
import { useGlobalContext } from "../GlobalContext";
import React from "react";
import { ChapterKeys, StickyItem } from "../types/global";
import Card from "../components/Card";
import Graph from "../components/Graph";
import Welcome from "./Welcome";

type MobileProps = {
	dataKey: ChapterKeys;
};

const Mobile: React.FC<MobileProps> = ({ dataKey }) => {
	const { headerHeight } = useGlobalContext();
	const typedData = data as Record<ChapterKeys, StickyItem[]>;
	const dataArray = typedData[dataKey];

	return (
		<section id={dataKey}>
			{dataKey === "einleitung" && (
				<>
					<Welcome />
					<div className="w-full h-[10vh]" />
				</>
			)}
			{dataArray.map((item: StickyItem, index: number) => (
				<div key={index} style={{ paddingTop: headerHeight + 50 }}>
					<Card
						key={item.id}
						dataKey={dataKey}
						title={item.title}
						displayNumber={item.displayNumber}
						text={item.text}
					/>
					<div className="w-full h-[10vh]" />
					<Graph data={dataArray[index] as StickyItem} />
				</div>
			))}
		</section>
	);
};

export default Mobile;
