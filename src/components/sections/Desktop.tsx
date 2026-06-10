import React, { useEffect, useState } from "react";
import chapterData from "@/data/chapters.json";
import { ChapterKeys, DataObj, ChapterItem } from "@/types/global";
import Card from "@/components/Card";
import Welcome from "./Welcome";
import Chart from "@/components/Chart";

type DesktopProps = {
	chapterKey: ChapterKeys;
};

const Desktop: React.FC<DesktopProps> = ({ chapterKey }) => {
	const [activeChapterItem, setActiveChapterItem] =
		useState<ChapterItem | null>(null);

	const chapters = chapterData as DataObj;
	const chapterItems = chapters[chapterKey];

	useEffect(() => {
		if (chapterItems) {
			setActiveChapterItem(chapterItems[0] as ChapterItem);
		}
	}, [chapterItems]);

	return (
		<div id={chapterKey}>
			{chapterKey === "einleitung" && <Welcome />}
			<section className="relative w-[90vw] mx-auto flex gap-6">
				<div className="flex-[3] h-[calc(100vh-var(--header-height))] sticky top-[var(--header-height)] flex items-center">
					<div className="w-full">
						{activeChapterItem && (
							<Chart chapter={activeChapterItem as ChapterItem} />
						)}
					</div>
				</div>
				<div className="flex-[2]">
					{chapterItems.map((chapterItem: ChapterItem) => (
						<Card
							key={chapterItem.id}
							chapterKey={chapterKey}
							chapterItem={chapterItem}
							onSetCurrent={() =>
								setActiveChapterItem(chapterItem as ChapterItem)
							}
							isNotCurrent={chapterItem.id !== activeChapterItem?.id}
						/>
					))}
				</div>
			</section>
		</div>
	);
};

export default Desktop;
