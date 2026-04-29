import React, { useEffect, useRef } from "react";
import { useGlobalContext } from "@/GlobalContext";
import data from "@/data/chapters.json";
import { ChapterItem, ChapterKeys } from "@/types/global";
import { cn, isInRange } from "@/utilities";

type CardProps = {
	chapterKey: ChapterKeys;
	chapterItem: ChapterItem;
	bigTitleCard?: boolean;
	onSetCurrent?: () => void;
	isNotCurrent?: boolean;
};

const Card: React.FC<CardProps> = ({
	chapterKey,
	chapterItem,
	bigTitleCard,
	onSetCurrent,
	isNotCurrent,
}) => {
	const { isMobile } = useGlobalContext();
	const { id, title, text } = chapterItem;
	const cardRef = useRef<HTMLDivElement>(null);

	// displayNumber
	const displayNumber = `${Object.keys(data).indexOf(chapterKey) + 1}.${data[chapterKey as keyof typeof data].findIndex((indexItem) => indexItem.id === id) + 1}`;
	const showDisplayNumber =
		typeof window !== "undefined" &&
		window.location.toString().includes("localhost") &&
		displayNumber;

	const handleScroll = () => {
		if (isMobile) {
			return;
		}
		if (cardRef.current) {
			const rect = cardRef.current.getBoundingClientRect();
			if (
				(isInRange(rect.top - window.innerHeight / 2) ||
					isInRange(rect.bottom - window.innerHeight / 2)) &&
				isNotCurrent &&
				onSetCurrent
			) {
				onSetCurrent();
			}
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div
			className={cn(
				"flex items-center lg:min-h-screen",
				bigTitleCard && "lg:py-[calc(var(--header-height)+2rem)]",
			)}
		>
			<div
				ref={cardRef}
				className="w-fit max-lg:mb-[10vh] lg:p-6 lg:border-[2px] border-foreground"
			>
				{showDisplayNumber && <h4>{displayNumber}</h4>}
				<h2 dangerouslySetInnerHTML={{ __html: title }} />
				{text && (
					<p
						className="mt-4 max-w-[80ch] serif"
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				)}
			</div>
		</div>
	);
};

export default Card;
