import React, { useState } from "react";
import Icon from "./Icons";
import chapters from "../data/chapters.json";
import colors from "../data/colors.json";
import { useGlobalContext } from "../GlobalContext";

const Header: React.FC = () => {
	const {
		theme,
		toggleTheme,
		chapter: globalChapter,
		setChapter,
	} = useGlobalContext();
	const [open, setOpen] = useState<boolean>(false);
	return (
		<>
			<header
				className={`fixed top-0 left-0 w-screen z-11 flex justify-between items-center ${theme}`}
			>
				<div
					onClick={() => window.scrollTo(0, 0)}
					className="cursor-pointer size-24"
				>
					<Icon id="innodaten_logo_wording" />
				</div>
				<div className="flex items-center gap-8">
					<div className="flex items-center gap-8">
						<div
							className="flex items-center gap-4 cursor-pointer"
							onClick={() => setOpen(!open)}
							onMouseEnter={() => setOpen(true)}
						>
							<h4>{globalChapter}</h4>
							{/* @refactor */}
							<div className={`size-24 ${open && "rotate-180"}`}>
								<Icon id="chevron" />
							</div>
						</div>
					</div>
					<div className={`cursor-pointer size-24 `} onClick={toggleTheme}>
						{theme === "dark" ? (
							<Icon id="moon" setColor={colors.white} />
						) : (
							<Icon id="sun" setColor={colors.blue} />
						)}
					</div>
				</div>
			</header>
			{open && (
				<ul
					className={`fixed nav-ul py-6 px-12 z-12 ${theme}`}
					style={{
						left: "auto",
						right: window.innerWidth / 2,
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
