import React from "react";
import { useGlobalContext } from "../GlobalContext";
import colors from "../data/colors.json";

const RegionToggle: React.FC = () => {
	const { theme, region, setRegion } = useGlobalContext();
	const getColor = (downRegion: string) => {
		if (downRegion !== region) {
			return theme === "dark" ? colors.dark : colors.white;
		}
		return theme === "dark" ? colors.white : colors.blue;
	};
	return (
		<div className="flex w-full justify-end mb-8">
			<div>
				<p className="mb-2 bold">Region:</p>
				<div className={`scale-toggle flex ${theme}`}>
					<div
						onClick={() => setRegion("ber")}
						className="toggle-button flex items-center justify-center cursor-pointer"
					>
						<p
							className="ignore bold"
							style={{
								color: getColor("ber"),
							}}
						>
							Berlin
						</p>
					</div>
					<div
						onClick={() => setRegion("de")}
						className="toggle-button flex items-center justify-center cursor-pointer"
					>
						<p
							className="ignore bold"
							style={{
								color: getColor("de"),
							}}
						>
							Deutschland
						</p>
					</div>
					<div id="indicator" className={region === "ber" ? "left" : "right"} />
				</div>
			</div>
		</div>
	);
};

export default RegionToggle;
