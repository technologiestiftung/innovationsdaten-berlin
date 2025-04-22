import React, { useEffect, useRef, useState } from "react";
import { isInRange } from "../utilities";

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
	const cardRef = useRef<HTMLDivElement>(null);
	const [specificMargin, setSpecificMargin] = useState(0);
	const [cardHeight, setCardHeight] = useState<number | null>(null);
	const getMarginTop = () => {
		if (cardHeight) {
			return (window.innerHeight - cardHeight) / 2;
		}
		if (first) {
			return specificMargin;
		}
		return window.innerHeight;
	};
	const getMarginBottom = () => {
		if (cardHeight) {
			return (window.innerHeight - cardHeight) / 2;
		}
		if (last) {
			return window.innerHeight;
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
			const subtraction = window.innerHeight - getCardHeight;
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
	}, []);
	return (
		<div
			ref={cardRef}
			className={`card p-6 border-2 border-blue dark:border-white bg-white dark:bg-dark`}
			style={{
				marginTop: getMarginTop(),
				marginBottom: getMarginBottom(),
			}}
		>
			{typeof window !== "undefined" &&
				(window.location.href.includes("localhost") ||
					window.location.href.includes("staging")) &&
				displayNumber && <h4>{displayNumber}</h4>}
			{/* @refactor: hypens & break-words for title */}
			<h2 className="">{title}</h2>
			<p className="mt-4">{text}</p>
		</div>
	);
};

export default Card;
