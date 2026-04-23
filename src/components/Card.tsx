import React, { useEffect, useRef } from "react";
import { isInRange } from "../utilities";
import { useGlobalContext } from "../GlobalContext";
import data from "../data/data.json";
import { StickyItem } from "../types/global";

type CardProps = {
	dataKey: string;
	item: StickyItem;
	onSetCurrent?: () => void;
	isNotCurrent?: boolean;
};

const Card: React.FC<CardProps> = ({
	dataKey,
	item,
	onSetCurrent,
	isNotCurrent,
}) => {
	const { isMobile } = useGlobalContext();
	const { id, title, text } = item;
	const cardRef = useRef<HTMLDivElement>(null);

	// displayNumber
	const displayNumber = `${Object.keys(data).indexOf(dataKey) + 1}.${data[dataKey as keyof typeof data].findIndex((indexItem) => indexItem.id === id) + 1}`;
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
		<div className="flex items-center lg:h-screen">
			<div
				ref={cardRef}
				className="w-fit lg:p-6 lg:border-[2px] border-foreground"
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
