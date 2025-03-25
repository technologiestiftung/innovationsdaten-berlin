import React from "react";
import Icon from "./Icons";
import colors from "../data/colors.json";
import { useGlobalContext } from "../GlobalContext";

const Header: React.FC = () => {
	const { fontSize, theme, toggleTheme } = useGlobalContext();
	const toggleIconSize = fontSize * 2;
	return (
		<header
			className={`fixed top-0 left-0 w-screen z-[100] flex justify-between items-center ${theme}`}
		>
			<Icon id="innodaten_logo_wording" size={window.innerHeight * 0.05} />
			<div className={`cursor-pointer`} onClick={toggleTheme}>
				{theme === "dark" ? (
					<Icon id="moon" size={toggleIconSize} setColor={colors.white} />
				) : (
					<Icon id="sun" size={toggleIconSize} setColor={colors.blue} />
				)}
			</div>
		</header>
	);
};

export default Header;
