import { useState } from "react";
import Icon from "./Icons";
import chapters from "../data/chapters.json";
import Menu from "./Menu";
import wordings from "../data/wordings.json";
import { cn } from "../utilities";
import { Chapter } from "../types/global";

const Header = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [chapter, setChapter] = useState<string>("Einleitung");

	const toggleTheme = () => {
		const root = document.documentElement;
		const isDark = root.getAttribute("data-theme") === "dark";
		root.toggleAttribute("data-theme", !isDark);
		if (!isDark) {
			root.setAttribute("data-theme", "dark");
		}
	};

	const handleChapterClick = (singleChapter: Chapter) => {
		setLoading(true);
		setOpen(false);
		setTimeout(() => {
			setChapter(singleChapter.title);
			setLoading(false);
		}, 1000);
	};

	return (
		<>
			<header
				className={cn(
					// measures
					`h-[var(--header-height)] w-full`,
					// position
					"fixed top-0 left-0",
					// layout
					"flex justify-between items-center px-3 lg:px-[10vw]",
					// borders
					"border-b-[2px] border-foreground",
					// rest
					"bg-background z-[11]",
				)}
			>
				<div onClick={() => window.scrollTo(0, 0)} className="cursor-pointer">
					<Icon id="innodaten_logo" className="h-8 lg:hidden" />
					<Icon id="innodaten_logo_wording" className="hidden lg:block h-10" />
				</div>
				<div className="flex items-center gap-4 lg:gap-8 lg:pr-4">
					<div
						className="cursor-pointer flex items-center gap-2"
						onClick={toggleTheme}
					>
						<Icon id="invert-text" className="size-6" />
						<p className="select-none hidden lg:block">
							{wordings.invert_text}
						</p>
					</div>
					<div className="flex items-center">
						<div
							className="flex items-center cursor-pointer gap-2 lg:gap-4"
							onClick={() => setOpen(!open)}
							onMouseEnter={() => setOpen(true)}
						>
							{!loading && <h5 className="text-right">{chapter}</h5>}
							<div
								className={
									open
										? "rotate-180 transition-transform"
										: "transition-transform"
								}
							>
								<Icon id="chevron" className="size-6" />
							</div>
						</div>
					</div>
				</div>
			</header>
			{open && (
				<ul
					className={cn(
						// measures
						"max-lg:h-[calc(100vh-var(--header-height))] max-lg:w-full",
						// position
						"fixed left-auto top-[calc(var(--header-height)-2px)] lg:right-[10vw]",
						// layout
						"py-6 px-12",
						// borders
						"lg:border-r-[2px] lg:border-l-[2px] lg:border-b-[2px] border-foreground",
						// rest
						"bg-background z-[12]",
					)}
					onMouseLeave={() => setOpen(false)}
				>
					{chapters.map((singleChapter) => (
						<li key={singleChapter.link} className="my-4">
							<a
								href={`#${singleChapter.link}`}
								onClick={() => handleChapterClick(singleChapter as Chapter)}
							>
								<h4
									className={cn(
										"select-none",
										chapter === singleChapter.title && "underline",
									)}
								>
									{singleChapter.title}
								</h4>
							</a>
						</li>
					))}
				</ul>
			)}
			<Menu chapter={chapter} setChapter={setChapter} />
		</>
	);
};

export default Header;
