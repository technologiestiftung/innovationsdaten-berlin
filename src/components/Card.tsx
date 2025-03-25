import React, { useEffect, useRef, useState } from "react";
import { isInRange } from "../utilities";
import { StickyItem } from "../types/global";
import { useGlobalContext } from "../GlobalContext";

type CardProps = {
	title: string;
	text: string;
	item: StickyItem;
	current: StickyItem | null;
	setCurrent: React.Dispatch<React.SetStateAction<StickyItem | null>>;
	last: boolean;
};

const Card: React.FC<CardProps> = ({
	title,
	text,
	item,
	current,
	setCurrent,
	last,
}) => {
	const { theme, headerHeight } = useGlobalContext();
	const cardRef = useRef<HTMLDivElement>(null);
	const [marginBottomOfLastCard, setMarginBottomOfLastCard] = useState(0);
	const handleScroll = () => {
		if (cardRef.current) {
			const rect = cardRef.current.getBoundingClientRect();
			if (
				isInRange(rect.top - window.innerHeight / 1.5, -50, 50) &&
				current !== item
			) {
				setCurrent(item);
			}
		}
	};
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	useEffect(() => {
		if (last) {
			const getCard = document.querySelector("#branchen .card:last-of-type");
			if (!getCard) {
				return;
			}
			const cardHeight = getCard?.getBoundingClientRect().height;
			const subtraction = window.innerHeight - cardHeight - headerHeight;
			const getMargin = subtraction / 2;
			setMarginBottomOfLastCard(getMargin);
		}
	}, [headerHeight]);
	return (
		<div
			ref={cardRef}
			className={`card p-6 ${theme}`}
			style={{
				marginTop: window.innerHeight - headerHeight,
				marginBottom: marginBottomOfLastCard,
			}}
		>
			<h2 className="mb-4">{title}</h2>
			<p>{text}</p>
		</div>
	);
};

export default Card;
