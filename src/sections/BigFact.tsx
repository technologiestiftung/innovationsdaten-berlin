import React, { useEffect, useRef, useState } from "react";
import facts from "../data/big-facts.json";
import { useGlobalContext } from "../GlobalContext";

interface BigFactProps {
	factKey: string;
}

type BigFact = {
	title: string;
	fact: string;
	unit: string;
	text?: string;
};

const BigFact: React.FC<BigFactProps> = ({ factKey }) => {
	const { fontSize: globalFontSize } = useGlobalContext();
	const bigFact = (facts as Record<string, BigFact>)[factKey];

	const textRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
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
		<section
			ref={containerRef}
			id={`big-fact-${factKey}`}
			className="big-fact py-14"
		>
			<h2 className="mb-8">{bigFact?.title}</h2>
			<div className="w-full flex justify-center">
				<h1
					ref={textRef}
					className="text-center leading-none ignore"
					style={{ fontSize }}
				>
					{bigFact?.fact}
				</h1>
			</div>
			<h2 className="text-center mb-8">{bigFact?.unit}</h2>
			{!!bigFact?.text && <p>{bigFact?.text}</p>}
		</section>
	);
};

export default BigFact;
