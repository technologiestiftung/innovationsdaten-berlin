import React, { useState } from "react";
import Chevron from "../assets/chevron.svg?react";
import Moon from "../assets/moon.svg?react";
import Sun from "../assets/sun.svg?react";
import chapters from "../data/chapters.json";
import { useGlobalContext } from "../GlobalContext";
import InnoDatenLogo from "../assets/innodaten_logo_wording.svg?react";
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
				className={`fixed top-0 py-6 px-48 left-0 w-screen z-11 flex justify-between items-center h-24
					bg-white dark:bg-dark text-black dark:text-white border-b-2 border-blue dark:border-white
					`}
			>
				<div
					onClick={() => window.scrollTo(0, 0)}
					className="cursor-pointer  dark:text-white"
				>
					<InnoDatenLogo className="size-64 h-full fill-blue dark:fill-white" />
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
							<div className={`${open && "rotate-180"}`}>
								<Chevron className="size-6 fill-blue dark:fill-white" />
							</div>
						</div>
					</div>
					<div className={`cursor-pointer`} onClick={toggleTheme}>
						{(theme === "dark" && (
							<Sun className="fill-blue size-8 dark:fill-white" />
						)) || <Moon className="fill-blue size-8 dark:fill-white" />}
					</div>
				</div>
			</header>
			{open && (
				<ul
					className={`fixed nav-ul py-6 px-12 z-12 w-full h-full md:w-auto md:h-auto bg-white dark:bg-dark text-black dark:text-white md:top-24 md:right-48`}
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
