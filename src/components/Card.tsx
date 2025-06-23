import React, { useEffect, useRef, useState } from "react";
import { isInRange } from "../utilities";
import { useGlobalContext } from "../GlobalContext";
import Icon from "./Icons";

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
	const { theme, headerHeight, isMobile } = useGlobalContext();
	const cardRef = useRef<HTMLDivElement>(null);
	const cardTextRef = useRef<HTMLDivElement>(null);
	const [specificMargin, setSpecificMargin] = useState(0);
	const [cardHeight, setCardHeight] = useState<number | null>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);
	const hide = true;

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
		const p = cardTextRef.current;
		if (p) {
			const hasOverflow = p.scrollHeight > p.clientHeight;
			setIsOverflowing(hasOverflow);
		}
	}, []);
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
			className={`card w-full ${theme} ${isMobile ? "" : "p-6"}`}
			style={{
				marginTop: getMarginTop(),
				marginBottom: getMarginBottom(),
			}}
		>
			{typeof window !== "undefined" &&
				window.location.toString().includes("localhost") &&
				displayNumber &&
				!hide && <h4>{displayNumber}</h4>}
			<h2 dangerouslySetInnerHTML={{ __html: title }} />
			{text && (
				<p
					className={`mt-4 max-w-[80ch] ${isMobile ? "" : "max-h-[30vh] overflow-y-scroll custom-scroll"} serif ${theme}`}
					ref={cardTextRef}
					dangerouslySetInnerHTML={{ __html: text }}
				/>
			)}
			{isOverflowing && (
				<>
					<div className="w-full h-4" />
					<div className="w-full flex justify-end">
						<Icon id="scroll_text" />
					</div>
				</>
			)}
		</div>
	);
};

export default Card;
