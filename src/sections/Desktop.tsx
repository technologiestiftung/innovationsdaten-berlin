import data from "../data/data.json";
import React, { useEffect, useState } from "react";
import { ChapterKeys, DataObj, StickyItem } from "../types/global";
import Card from "../components/Card";
import Graph from "../components/Graph";
import Welcome from "./Welcome";
import { cn } from "../utilities";

type DesktopProps = {
	dataKey: ChapterKeys;
};

const Desktop: React.FC<DesktopProps> = ({ dataKey }) => {
	const [activeItem, setActiveItem] = useState<StickyItem | null>(null);

	const chapters = data as DataObj;
	const items = chapters[dataKey];

	useEffect(() => {
		if (items) {
			setActiveItem(items[0] as StickyItem);
		}
	}, [items]);

	return (
		<div id={dataKey}>
			{dataKey === "einleitung" && <Welcome />}
			<section className="relative w-[80vw] mx-auto flex gap-6">
				<div
					className={cn(
						// measures
						"flex-[3] h-screen",
						// position
						"sticky top-0",
						// layout
						"flex items-center",
					)}
				>
					<div className="w-full">
						<Graph data={activeItem as StickyItem} />
					</div>
				</div>
				<div className="flex-[2]">
					{items.map((item: StickyItem) => (
						<Card
							key={item.id}
							dataKey={dataKey}
							item={item}
							onSetCurrent={() => setActiveItem(item as StickyItem)}
							isNotCurrent={item.id !== activeItem?.id}
						/>
					))}
				</div>
			</section>
		</div>
	);
};

export default Desktop;
