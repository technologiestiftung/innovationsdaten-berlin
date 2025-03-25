import React, { useEffect, useRef, useState } from "react";
import facts from "../data/big-facts-comparison.json";
import { useGlobalContext } from "../GlobalContext";

interface BigFactComparisonProps {
	factKey: string;
}

type FactItem = {
	accent: string;
	sub: string;
	fact: string;
};

type BigFactComparison = {
	title: string;
	facts: FactItem[];
	text: string;
};

interface SingleBigFactComparisonProps {
	fact: FactItem;
}

const BigFactComparison: React.FC<BigFactComparisonProps> = ({ factKey }) => {
	const { fontSize: globalFontSize } = useGlobalContext();
	const bigFact = (facts as Record<string, BigFactComparison>)[factKey];
	const containerRef = useRef<HTMLDivElement>(null);

	const SingleBigFactComparison: React.FC<SingleBigFactComparisonProps> = ({
		fact,
	}) => {
		const textRef = useRef<HTMLDivElement>(null);
		const [fontSize, setFontSize] = useState(globalFontSize);

		useEffect(() => {
			const resizeText = () => {
				if (textRef.current && containerRef.current) {
					let size = globalFontSize;
					textRef.current.style.fontSize = `${size}px`;
					while (
						textRef.current.offsetWidth <
							containerRef.current.offsetWidth * 0.8 &&
						size < 300
					) {
						size += 1;
						textRef.current.style.fontSize = `${size}px`;
					}
					setFontSize(size);
				}
			};
			resizeText();
			window.addEventListener("resize", resizeText);
			return () => window.removeEventListener("resize", resizeText);
		}, []);
		return (
			<>
				<h2 className="text-center">
					{fact?.accent}
					<br />
					<span className="fw-normal">{fact?.sub}</span>
				</h2>
				<div className="w-full flex justify-center mb-4">
					<h1
						ref={textRef}
						className="text-center leading-none ignore select-none"
						style={{ fontSize }}
					>
						{fact?.fact}
					</h1>
				</div>
			</>
		);
	};

	return (
		<section
			ref={containerRef}
			id={`big-fact-${factKey}`}
			className="big-fact py-14"
		>
			<h1 className="mb-8">{bigFact?.title}</h1>
			{bigFact?.facts.map((fact, index) => (
				<SingleBigFactComparison key={index} fact={fact} />
			))}
			<p>{bigFact?.text}</p>
		</section>
	);
};

export default BigFactComparison;
