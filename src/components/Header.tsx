import React, { useState } from "react";
import Icon from "./Icons";
import chapters from "../data/chapters.json";
import { useGlobalContext } from "../GlobalContext";

const Header: React.FC = () => {
	const {
		fontSize,
		theme,
		chapter: globalChapter,
		setChapter,
		headerHeight,
		breakPoint,
	} = useGlobalContext();
	const [open, setOpen] = useState<boolean>(false);
	return (
		<>
			<header
				className={`fixed top-0 left-0 w-screen z-[11] flex justify-between items-center ${theme}`}
			>
				<div onClick={() => window.scrollTo(0, 0)} className="cursor-pointer">
					<Icon id="innodaten_logo_wording" size={fontSize * 2.5} />
				</div>
				<div className="flex items-center gap-8">
					<div
						className="flex items-center gap-4 cursor-pointer"
						onClick={() => setOpen(!open)}
						onMouseEnter={() => setOpen(true)}
					>
						<h4>{globalChapter}</h4>
						<div style={{ transform: open ? "rotate(180deg)" : "none" }}>
							<Icon id="chevron" size={fontSize * 1.5} />
						</div>
					</div>
				</div>
			</header>
			{open && (
				<ul
					className={`fixed nav-ul py-6 px-12 z-[12] ${theme}`}
					style={{
						top: headerHeight - 2,
						left: "auto",
						right: (window.innerWidth - breakPoint) / 2 - fontSize,
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
