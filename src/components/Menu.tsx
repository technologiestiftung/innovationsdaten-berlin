import React, { useEffect, useState } from "react";
import chapters from "../data/chapters.json";
import { useGlobalContext } from "../GlobalContext";

interface NavProps {
	link: string;
	title: string;
}

const Menu: React.FC = () => {
	const { chapter, setChapter } = useGlobalContext();

	const NavStep: React.FC<NavProps> = ({ link, title }) => {
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
			if (window.pageYOffset < window.innerHeight) {
				setChapter("Willkommen");
			} else if (element) {
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
				className={`relative flex items-center size-6 border-2 border-blue dark:border-white cursor-pointer ${
					isOpen || chapter === title
						? "bg-blue dark:bg-white"
						: "bg-white dark:bg-dark"
				}`}
				onClick={() => scrollToIdWithOffset(link)}
			>
				{(isOpen || mouseIn) && (
					<div
						className={`absolute bg-blue text-white dark:text-dark dark:bg-white right-full mr-2 top-1/2 -translate-y-1/2 p-2 whitespace-nowrap`}
					>
						<p className="bold">{title}</p>
					</div>
				)}
			</a>
		);
	};

	return (
		<nav className="fixed top-1/2 right-10 -translate-y-1/2 flex flex-col gap-2 z-10">
			{chapters.map((mapChapter) => (
				<NavStep
					key={mapChapter.link}
					link={mapChapter.link}
					title={mapChapter.title}
				/>
			))}
		</nav>
	);
};

export default Menu;
