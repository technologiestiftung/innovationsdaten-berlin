import React, { useEffect, useRef, useState } from "react";
import { isInRange } from "../utilities";
import { useGlobalContext } from "../GlobalContext";

type CardProps = {
	dataKey: string;
	title: string;
	displayNumber?: string;
	text?: string;
	onSetCurrent?: () => void;
	isNotCurrent?: boolean;
	last?: boolean;
	first?: boolean;
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
	const { theme, headerHeight, isMobile, smallerDesktop } = useGlobalContext();
	const cardRef = useRef<HTMLDivElement>(null);
	const cardTextRef = useRef<HTMLDivElement>(null);
	const [specificMargin, setSpecificMargin] = useState(0);
	const [cardHeight, setCardHeight] = useState<number | null>(null);
	const hide = false;

	const getMarginTop = () => {
		if (isMobile) {
			return 0;
		}
		if (cardHeight) {
			return (window.innerHeight - cardHeight - headerHeight) / 2;
		}
		if (first) {
			return specificMargin;
		}
		return window.innerHeight - headerHeight;
	};
	const checkMarginTop = () => {
		const getMarginTopFromFuntion = getMarginTop();
		if (getMarginTopFromFuntion < 0) {
			return 0;
		}
		return getMarginTopFromFuntion;
	};
	const getMarginBottom = () => {
		if (cardHeight) {
			return (window.innerHeight - cardHeight - headerHeight) / 2;
		}
		if (last) {
			return window.innerHeight - headerHeight;
		}
		return 0;
	};
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
			className={`card w-fit ${theme} ${isMobile ? "" : "p-6"}`}
			style={{
				marginTop: checkMarginTop(),
				marginBottom: getMarginBottom(),
			}}
		>
			{typeof window !== "undefined" &&
				window.location.toString().includes("localhost") &&
				displayNumber &&
				!hide && <h4>{displayNumber}</h4>}
			{window.innerWidth <= smallerDesktop ? (
				<h3 dangerouslySetInnerHTML={{ __html: title }} />
			) : (
				<h2 dangerouslySetInnerHTML={{ __html: title }} />
			)}
			{text && (
				<p
					className={`mt-4 max-w-[80ch] serif ${theme}`}
					ref={cardTextRef}
					dangerouslySetInnerHTML={{ __html: text }}
				/>
			)}
		</div>
	);
};

export default Card;
