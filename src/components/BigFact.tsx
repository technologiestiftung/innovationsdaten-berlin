import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../GlobalContext";

interface BigFactProps {
	fact: string;
	unit?: string;
}

const BigFact: React.FC<BigFactProps> = ({ fact, unit }) => {
	const { fontSize: globalFontSize } = useGlobalContext();
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
		<>
			<div ref={containerRef} className="w-full flex justify-center">
				<h1
					ref={textRef}
					className="text-center leading-none ignore select-none"
					style={{ fontSize }}
				>
					{fact}
				</h1>
			</div>
			<h2 className="text-center mb-8">{unit}</h2>
		</>
	);
};

export default BigFact;
