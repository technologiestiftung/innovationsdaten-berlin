import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../GlobalContext";

interface BigFactComparisonProps {
	facts: { fact: string; unit: string }[];
}

const BigFactComparison: React.FC<BigFactComparisonProps> = ({ facts }) => {
	const { fontSize: globalFontSize } = useGlobalContext();

	const SingleFact = ({ fact, unit }: any) => {
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
			<div className="flex-1">
				<div ref={containerRef} className="w-full flex justify-center">
					<h1
						ref={textRef}
						className="text-center leading-none ignore select-none"
						style={{ fontSize }}
					>
						{fact}
					</h1>
				</div>
				<h3 className="text-center mb-8">{unit}</h3>
			</div>
		);
	};

	return (
		<div className="flex gap-8">
			{facts.map((item, index) => (
				<SingleFact key={index} fact={item.fact} unit={item.unit} />
			))}
		</div>
	);
};

export default BigFactComparison;
