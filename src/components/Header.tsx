import React, { useState } from "react";
import Icon from "./Icons";
import chapters from "../data/chapters.json";
import { useGlobalContext } from "../GlobalContext";

const Header: React.FC = () => {
	const {
		fontSize,
		theme,
		toggleTheme,
		chapter: globalChapter,
		setChapter,
		headerHeight,
		breakPoint,
		isMobile,
	} = useGlobalContext();
	const [open, setOpen] = useState<boolean>(false);
	const toggleIconSize = fontSize * 1.5;
	return (
		<>
			<header
				className={`fixed top-0 left-0 w-screen z-11 flex justify-between items-center ${theme}`}
			>
				<div onClick={() => window.scrollTo(0, 0)} className="cursor-pointer">
					<Icon
						id={isMobile ? "innodaten_logo" : "innodaten_logo_wording"}
						size={isMobile ? 30 : fontSize * 2.5}
					/>
				</div>
				<div
					className={`flex items-center ${isMobile ? "gap-4" : "gap-8 pr-4"}`}
				>
					<div
						className={`cursor-pointer ${theme} flex items-center gap-2`}
						onClick={toggleTheme}
					>
						<Icon id="invert-text" size={toggleIconSize} />
						{!isMobile && <p className="select-none">Text invertieren</p>}
					</div>
					<div className="flex items-center">
						<div
							className={`flex items-center cursor-pointer ${isMobile ? "gap-2" : "gap-4"}`}
							onClick={() => setOpen(!open)}
							onMouseEnter={() => setOpen(true)}
						>
							<h5 className="text-right">{globalChapter}</h5>
							<div
								className={
									open
										? "rotate-180 transition-transform"
										: "transition-transform"
								}
							>
								<Icon id="chevron" size={fontSize * 1.5} />
							</div>
						</div>
					</div>
				</div>
			</header>
			{open && (
				<ul
					className={`fixed nav-ul py-6 px-12 ${theme} ${isMobile ? "w-full" : ""}`}
					style={{
						top: headerHeight - 2,
						left: "auto",
						right: isMobile ? 0 : (window.innerWidth - breakPoint) / 2,
						height: isMobile ? window.innerHeight - headerHeight + 2 : "auto",
					}}
					onMouseLeave={() => setOpen(false)}
				>
					{chapters.map((chapter) => (
						<li key={chapter.link} className="my-4">
							<a
								href={`#${chapter.link}`}
								onClick={() => {
									setChapter(chapter.title);
									setOpen(false);
								}}
							>
								<h4
									className={`select-none ${globalChapter === chapter.title ? "underline" : ""}`}
								>
									{chapter.title}
								</h4>
							</a>
						</li>
					))}
				</ul>
			)}
		</>
	);
};

export default Header;
