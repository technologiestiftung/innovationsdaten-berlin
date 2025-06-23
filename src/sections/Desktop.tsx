import data from "../data/data.json";
import { useGlobalContext } from "../GlobalContext";
import React, { useEffect, useState } from "react";
import { ChapterKeys, StickyItem } from "../types/global";
import Card from "../components/Card";
import Graph from "../components/Graph";
import Welcome from "./Welcome";

type DesktopProps = {
	dataKey: ChapterKeys;
};

const Desktop: React.FC<DesktopProps> = ({ dataKey }) => {
	const { headerHeight, widthOfCardContainer, widthOfStickyContainer } =
		useGlobalContext();
	const typedData = data as Record<ChapterKeys, StickyItem[]>;
	const dataArray = typedData[dataKey];
	const [current, setCurrent] = useState<StickyItem | null>(null);

	useEffect(() => {
		if (dataArray) {
			setCurrent(dataArray[0] as StickyItem);
		}
	}, [dataArray]);

	return (
		<div id={dataKey}>
			{dataKey === "einleitung" && <Welcome />}
			<section
				className="sticky-section relative w-full flex gap-6"
				style={{ paddingTop: headerHeight }}
			>
				<div
					className="sticky flex items-center"
					style={{
						height: window.innerHeight - headerHeight,
						top: headerHeight,
						width: widthOfStickyContainer,
					}}
				>
					<div className="w-full">
						<Graph data={current as StickyItem} />
					</div>
				</div>
				<div
					className="overflow-hidden"
					style={{
						width: widthOfCardContainer,
					}}
				>
					{dataArray.map((item: StickyItem, index: number) => (
						<Card
							key={item.id}
							dataKey={dataKey}
							title={item.title}
							displayNumber={item.displayNumber}
							text={item.text}
							onSetCurrent={() => setCurrent(item as StickyItem)}
							isNotCurrent={item.id !== current?.id}
							last={index === dataArray.length - 1}
							first={!index}
						/>
					))}
				</div>
			</section>
		</div>
	);
};

export default Desktop;
