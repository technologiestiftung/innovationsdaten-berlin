import React from "react";
import { useGlobalContext } from "../GlobalContext";
import colors from "../data/colors.json";
import wordings from "../data/wordings.json";

type DataToggleProps = {
	toggleData: string;
	setToggleData: (toggleData: string) => void;
	allToggles: string[];
};

const DataToggleElement: React.FC<DataToggleProps> = ({
	toggleData,
	setToggleData,
	allToggles,
}) => {
	const { theme } = useGlobalContext();
	const getColor = (downData: string) => {
		if (downData !== toggleData) {
			return theme === "dark" ? colors.dark : colors.white;
		}
		return theme === "dark" ? colors.white : colors.blue;
	};
	return (
		<div className="flex w-full justify-end mb-8">
			<div>
				<p className="mb-2 bold">Auswählen:</p>
				<div className={`scale-toggle full flex ${theme}`}>
					{allToggles.map((toggle, index) => (
						<div
							key={index}
							onClick={() => setToggleData(toggle)}
							className="toggle-button flex items-center justify-center cursor-pointer"
						>
							<p
								className="ignore bold line-clamp-1 max-w-[100px]"
								style={{
									color: getColor(toggle),
								}}
							>
								{wordings[toggle as keyof typeof wordings]}
							</p>
						</div>
					))}
					<div
						id="indicator"
						className={toggleData === allToggles[0] ? "left" : "right"}
					/>
				</div>
			</div>
		</div>
	);
};

export default DataToggleElement;
