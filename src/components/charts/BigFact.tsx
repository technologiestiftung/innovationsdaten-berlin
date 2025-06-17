import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../GlobalContext";

interface BigFactProps {
	facts: { fact: string; unit: string }[] | undefined;
}

const BigFact: React.FC<BigFactProps> = ({ facts }) => {
	const { fontSize: globalFontSize, isMobile } = useGlobalContext();

	const SingleFact = ({ fact, unit }: any) => {
		const textRef = useRef<HTMLDivElement>(null);
		const containerRef = useRef<HTMLDivElement>(null);
		const [fontSize, setFontSize] = useState(globalFontSize);
		const [show, setShow] = useState<"visible" | "hidden">("hidden");

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
					setTimeout(() => {
						setShow("visible");
					}, 100);
				}
			};
			resizeText();
			window.addEventListener("resize", resizeText);
			return () => window.removeEventListener("resize", resizeText);
		}, []);

		return (
			<div
				className={`flex-1 `}
				style={{ opacity: show === "visible" ? 1 : 0 }}
			>
				<div ref={containerRef} className="w-full flex justify-center">
					<h2
						ref={textRef}
						className="text-center leading-none ignore select-none"
						style={{ fontSize }}
					>
						{fact}
					</h2>
				</div>
				<h3 className="text-center mb-8">{unit}</h3>
			</div>
		);
	};

	return (
		<div className={`flex gap-8 ${isMobile ? "flex-col w-full " : ""}`}>
			{facts?.map((item, index) => (
				<SingleFact key={index} fact={item.fact} unit={item.unit} />
			))}
		</div>
	);
};

export default BigFact;
