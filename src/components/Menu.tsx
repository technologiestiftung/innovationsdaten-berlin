import React, { useEffect, useRef, useState } from "react";
import chapters from "../data/chapters.json";
import { useGlobalContext } from "../GlobalContext";
import { isInRange } from "../utilities";

interface NavProps {
	link: string;
	title: string;
}

const Menu: React.FC = () => {
	const { theme } = useGlobalContext();
	const [open, setOpen] = useState<string | null>(null);
	const [mouseInGlobal, setMouseInGlobal] = useState<string | null>(null);

	const NavStep: React.FC<NavProps> = ({ link, title }) => {
		const [isOpen, setIsOpen] = useState(false);
		const triggered = useRef<boolean>(false);
		const [automatic, setAutomatic] = useState(false);
		const [mouseIn, setMouseIn] = useState(false);

		const handleScroll = () => {
			const element = document.getElementById(link);
			if (element) {
				const rect = element.getBoundingClientRect();
				if (
					isInRange(rect.top, -50, 50) &&
					!triggered.current &&
					!isOpen &&
					!mouseIn &&
					(mouseInGlobal === link || mouseInGlobal === null)
				) {
					triggered.current = true;
					setIsOpen(true);
					setAutomatic(true);
					setOpen(link);
				}
			}
		};

		useEffect(() => {
			window.addEventListener("scroll", handleScroll);
			return () => {
				window.removeEventListener("scroll", handleScroll);
			};
		}, []);

		useEffect(() => {
			if (automatic) {
				setTimeout(() => {
					setIsOpen(false);
					triggered.current = false;
					setAutomatic(false);
				}, 1500);
			}
		}, [automatic]);

		useEffect(() => {
			if (open !== link && isOpen) {
				setIsOpen(false);
				triggered.current = false;
				setAutomatic(false);
			}
		}, [open]);

		return (
			<a
				href={`#${link}`}
				onMouseEnter={() => {
					setIsOpen(true);
					setMouseIn(true);
					setMouseInGlobal(link);
				}}
				onMouseLeave={() => {
					setIsOpen(false);
					setMouseIn(false);
					setMouseInGlobal(null);
				}}
				className="relative flex items-center"
			>
				<div className={`${theme} ${isOpen ? "open" : ""}`} />
				{(isOpen || mouseIn) && (
					<div
						className={`absolute right-full mr-2 top-1/2 -translate-y-1/2 p-2 whitespace-nowrap ${theme}`}
					>
						<p className="ignore bold">{title}</p>
					</div>
				)}
			</a>
		);
	};

	return (
		<nav className="fixed top-1/2 -translate-y-1/2 flex flex-col gap-2">
			{chapters.map((chapter) => (
				<NavStep key={chapter.link} link={chapter.link} title={chapter.title} />
			))}
		</nav>
	);
};

export default Menu;
