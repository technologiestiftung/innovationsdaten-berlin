import React, { useEffect, useRef, useState } from "react";
import data from "../data.json";
import { useGlobalContext } from "../GlobalContext";
import { ChapterKeys, ChapterProps } from "../types/global";

interface BigFactProps {
	factKey: ChapterKeys;
}

const BigFact: React.FC<BigFactProps> = ({ factKey }) => {
	const { fontSize: globalFontSize, headerHeight } = useGlobalContext();
	const dataIndex: ChapterKeys = factKey;
	const { title, text, fact, unit } = data[
		dataIndex as keyof typeof data
	] as ChapterProps;
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
			id={factKey}
			className="flex flex-col justify-center min-h-screen"
			style={{ paddingTop: headerHeight }}
		>
			<h1 className="mb-8">{title}</h1>
			<div className="w-full flex justify-center">
				<h1
					ref={textRef}
					className="text-center leading-none ignore select-none"
					style={{ fontSize }}
				>
					{fact}
				</h1>
			</div>
			<h2 className="text-center mb-8">{unit}</h2>
			{!!text && <p>{text}</p>}
		</section>
	);
};

export default BigFact;
