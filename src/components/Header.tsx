import React, { useState } from "react";
import InnoDatenLogoWording from "../assets/innodaten_logo_wording.svg";
import Chevron from "../assets/chevron.svg";
import Moon from "../assets/moon.svg";
import Sun from "../assets/sun.svg";
import chapters from "../data/chapters.json";
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
				className={`fixed top-0 left-0 w-screen z-11 flex justify-between items-center `}
			>
				<div
					onClick={() => window.scrollTo(0, 0)}
					className="cursor-pointer size-24"
				>
					<img src={InnoDatenLogoWording} alt="InnoDatenLogoWording" />
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
								<img src={Chevron} alt="chevron" />
							</div>
						</div>
					</div>
					<div className={`cursor-pointer size-24 `} onClick={toggleTheme}>
						{(theme === "dark" && <img src={Sun} alt="sun" />) || (
							<img src={Moon} alt="moon" />
						)}
					</div>
				</div>
			</header>
			{open && (
				<ul
					className={`fixed nav-ul py-6 px-12 z-12`}
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
