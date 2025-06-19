import React from "react";
import { useGlobalContext } from "../../GlobalContext";

interface BigFactProps {
	facts: { fact: string; unit: string }[] | undefined;
}

const BigFact: React.FC<BigFactProps> = ({ facts }) => {
	const { isMobile } = useGlobalContext();

	const setFontSize = () => {
		if (isMobile) {
			return "10rem";
		}
		if (facts?.length === 1) {
			return "300px";
		}
		return "180px";
	};

	return (
		<div className={`flex gap-8 ${isMobile ? "flex-col w-full " : ""}`}>
			{facts?.map((item, index) => (
				<div className="flex-1" key={index}>
					<h2
						className="text-center leading-none ignore select-none"
						style={{ fontSize: setFontSize() }}
					>
						{item.fact}
					</h2>
					<h3 className="text-center mb-8">{item.unit}</h3>
				</div>
			))}
		</div>
	);
};

export default BigFact;
