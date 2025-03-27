import React, { useEffect, useRef, useState } from "react";
import { isInRange } from "../utilities";
import { useGlobalContext } from "../GlobalContext";

type CardProps = {
	dataKey: string;
	title: string;
	text?: string;
	onSetCurrent: () => void;
	isNotCurrent: boolean;
	last: boolean;
};

const Card: React.FC<CardProps> = ({
	dataKey,
	title,
	text,
	onSetCurrent,
	isNotCurrent,
	last,
}) => {
	const { theme, headerHeight } = useGlobalContext();
	const cardRef = useRef<HTMLDivElement>(null);
	const [marginBottomOfLastCard, setMarginBottomOfLastCard] = useState(0);
	const handleScroll = () => {
		if (cardRef.current) {
			const rect = cardRef.current.getBoundingClientRect();
			if (isInRange(rect.top - window.innerHeight / 1.5) && isNotCurrent) {
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
	useEffect(() => {
		if (last) {
			const getCard = document.querySelector(`#${dataKey} .card:last-of-type`);
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
			<h2 className={text ? "mb-4" : ""}>{title}</h2>
			<p>{text}</p>
		</div>
	);
};

export default Card;
