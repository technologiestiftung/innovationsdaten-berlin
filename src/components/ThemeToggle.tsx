import React from "react";
import Icon from "../components/Icons";
import colors from "../data/colors.json";
import { useGlobalContext } from "../GlobalContext";

const ThemeToggle: React.FC = () => {
	const { theme, fontSize, toggleTheme, isMobile } = useGlobalContext();
	const toggleIconSize = isMobile ? fontSize * 1.25 : fontSize * 2;
	return (
		<div
			className={`fixed p-2 toggle-container cursor-pointer overflow-hidden ${theme}`}
			onClick={toggleTheme}
		>
			{theme === "dark" ? (
				<Icon id="moon" size={toggleIconSize} setColor={colors.white} />
			) : (
				<Icon id="sun" size={toggleIconSize} setColor={colors.blue} />
			)}
		</div>
	);
};

export default ThemeToggle;
