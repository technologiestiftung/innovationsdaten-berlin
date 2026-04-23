import React, { useEffect, useState } from "react";
import chapters from "../data/chapters.json";
import { cn } from "../utilities";
import { Chapter } from "../types/global";

interface MenuProps {
	chapter: string;
	setChapter: (chapter: string) => void;
}

const Menu: React.FC<MenuProps> = ({ chapter, setChapter }) => {
	const NavStep = ({ singleChapter }: { singleChapter: Chapter }) => {
		const { link, title } = singleChapter;
		const [isOpen, setIsOpen] = useState(false);
		const [mouseIn, setMouseIn] = useState(false);

		const scrollToIdWithOffset = (id: string, offset: number = 2) => {
			const element = document.getElementById(id);
			if (element) {
				const top =
					element.getBoundingClientRect().top + window.pageYOffset + offset;

				window.scrollTo({
					top,
					behavior: "smooth",
				});
			}
		};

		const handleScroll = () => {
			const element = document.getElementById(link);
			if (element) {
				const rect = element.getBoundingClientRect();
				const top = rect.top + window.pageYOffset;
				const bottom = top + rect.height;
				const isInRange =
					window.pageYOffset >= top && window.pageYOffset <= bottom;
				if (isInRange && chapter !== title) {
					setChapter(title);
				}
			}
		};

		useEffect(() => {
			window.addEventListener("scroll", handleScroll);
			return () => {
				window.removeEventListener("scroll", handleScroll);
			};
		}, []);

		return (
			<a
				onMouseEnter={() => {
					setIsOpen(true);
					setMouseIn(true);
				}}
				onMouseLeave={() => {
					setIsOpen(false);
					setMouseIn(false);
				}}
				className="relative flex items-center cursor-pointer"
				onClick={() => scrollToIdWithOffset(link)}
			>
				<div
					className={cn(
						// measures
						"w-5 h-5",
						// borders
						"border-[2px] border-foreground",
						// rest
						"hover:bg-foreground",
						// conditionals
						(isOpen || chapter === title) && "bg-foreground",
					)}
				/>
				{(isOpen || mouseIn) && (
					<div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 p-2 whitespace-nowrap bg-foreground">
						<p className="text-background font-bold">{title}</p>
					</div>
				)}
			</a>
		);
	};

	return (
		<nav
			className={cn(
				// position
				"fixed top-1/2 left-auto right-[2vw] -translate-y-1/2 max-lg:translate-x-[100vw]",
				// layout
				"flex flex-col gap-2",
				// rest
				"z-10",
			)}
		>
			{chapters.map((singleChapter) => (
				<NavStep
					key={singleChapter.link}
					singleChapter={singleChapter as Chapter}
				/>
			))}
		</nav>
	);
};

export default Menu;
