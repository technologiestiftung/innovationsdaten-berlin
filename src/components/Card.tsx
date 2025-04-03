import React, { useEffect, useRef, useState } from "react";
import { isInRange } from "../utilities";
import { useGlobalContext } from "../GlobalContext";

type CardProps = {
	dataKey: string;
	title: string;
	displayNumber?: string;
	text?: string;
	onSetCurrent: () => void;
	isNotCurrent: boolean;
	last: boolean;
	first: boolean;
};

const Card: React.FC<CardProps> = ({
	dataKey,
	title,
	displayNumber,
	text,
	onSetCurrent,
	isNotCurrent,
	last,
	first,
}) => {
	const { theme, headerHeight } = useGlobalContext();
	const cardRef = useRef<HTMLDivElement>(null);
	const [specificMargin, setSpecificMargin] = useState(0);
	const [cardHeight, setCardHeight] = useState<number | null>(null);
	const getMarginTop = () => {
		if (cardHeight) {
			return (window.innerHeight - cardHeight - headerHeight) / 2;
		}
		if (first) {
			return specificMargin;
		}
		return window.innerHeight - headerHeight;
	};
	const getMarginBottom = () => {
		if (cardHeight) {
			return (window.innerHeight - cardHeight - headerHeight) / 2;
		}
		if (last) {
			return window.innerHeight - headerHeight;
			return specificMargin + window.innerHeight * 0.2;
		}
		return 0;
	};
	const handleScroll = () => {
		if (cardRef.current) {
			const rect = cardRef.current.getBoundingClientRect();
			if (
				(isInRange(rect.top - window.innerHeight / 2) ||
					isInRange(rect.bottom - window.innerHeight / 2)) &&
				isNotCurrent
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
	useEffect(() => {
		if (last || first) {
			const getCard = document.querySelector(
				last
					? `#${dataKey} .card:last-of-type`
					: `#${dataKey} .card:first-of-type`,
			);
			if (!getCard) {
				return;
			}
			const getCardHeight = getCard?.getBoundingClientRect().height;
			const subtraction = window.innerHeight - getCardHeight - headerHeight;
			const getMargin = subtraction / 2;
			setSpecificMargin(getMargin);
		}
		if (dataKey === "welcome") {
			const getCard = document.querySelector(
				last
					? `#${dataKey} .card:last-of-type`
					: `#${dataKey} .card:first-of-type`,
			);
			if (!getCard) {
				return;
			}
			setCardHeight(getCard?.getBoundingClientRect().height);
		}
	}, [headerHeight]);
	return (
		<div
			ref={cardRef}
			className={`card p-6 ${theme}`}
			style={{
				marginTop: getMarginTop(),
				marginBottom: getMarginBottom(),
			}}
		>
			{displayNumber && <h4>{displayNumber}</h4>}
			<h2
				className={text ? "mb-4" : ""}
				dangerouslySetInnerHTML={{ __html: title }}
			/>
			<p>{text}</p>
		</div>
	);
};

export default Card;
