import data from "@/data/chapters.json";
import React from "react";
import { ChapterKeys, DataObj, ChapterItem } from "@/types/global";
import Card from "@/components/Card";
import Welcome from "./Welcome";
import { cn } from "@/utilities";
import Chart from "@/components/Chart";

type MobileProps = {
	chapterKey: ChapterKeys;
};

const Mobile: React.FC<MobileProps> = ({ chapterKey }) => {
	const chapters = data as DataObj;
	const items = chapters[chapterKey];

	return (
		<section id={chapterKey}>
			{chapterKey === "einleitung" && <Welcome />}
			{items.map((item: ChapterItem, index: number) => (
				<div
					key={index}
					className={cn(
						"pt-[calc(var(--header-height)+50px)] flex flex-col",
						item.chart_type !== "matrix" && "gap-[10vh]",
					)}
				>
					<Card key={item.id} chapterKey={chapterKey} chapterItem={item} />
					<Chart chapter={items[index] as ChapterItem} />
				</div>
			))}
		</section>
	);
};

export default Mobile;
