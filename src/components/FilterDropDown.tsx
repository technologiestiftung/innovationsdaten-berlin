import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icons";
import colors from "../data/colors.json";
import branchen from "../data/branchen.json";
import sektoren from "../data/sektoren.json";
import { useGlobalContext } from "../GlobalContext";

interface FilterDropdownProps {
	allFilters: string[]; // ✅ Remove `undefined`
	activeFilters: string[];
	setFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
	allFilters,
	activeFilters,
	setFilters,
}) => {
	const { theme, fontSize } = useGlobalContext();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const allIndustrieBranchen: string[] = branchen
		.filter((branche) => branche.sektor_id === "industrie")
		.map((branche) => branche.id);
	const allDienstleistungenBranchen: string[] = branchen
		.filter((branche) => branche.sektor_id === "dienstleistungen")
		.map((branche) => branche.id);

	const toggleFilter = (filter: string) => {
		const updatedFilters = activeFilters.includes(filter)
			? activeFilters.filter((f) => f !== filter)
			: [...activeFilters, filter];
		setFilters(updatedFilters);
	};

	const toggleAll = () => {
		if (activeFilters.length === allFilters.length) {
			setFilters([]);
		} else {
			setFilters(allFilters);
		}
		return;
	};

	const checkForAllSektorChecked = (id: string) => {
		let allSektorsChecked = true;
		branchen.forEach((branche) => {
			if (branche.sektor_id === id && !activeFilters.includes(branche.id)) {
				allSektorsChecked = false;
			}
		});
		return allSektorsChecked;
	};

	const toggleSektor = (id: string) => {
		if (checkForAllSektorChecked(id)) {
			if (id === "industrie") {
				const newFilters = activeFilters.filter(
					(singleFilter) => !allIndustrieBranchen.includes(singleFilter),
				);
				setFilters(newFilters);
			} else {
				const newFilters = activeFilters.filter(
					(singleFilter) => !allDienstleistungenBranchen.includes(singleFilter),
				);
				setFilters(newFilters);
			}
			return;
		}
		if (id === "industrie") {
			const newFilters = activeFilters.filter(
				(singleFilter) => !allIndustrieBranchen.includes(singleFilter),
			);
			setFilters([...newFilters, ...allIndustrieBranchen]);
		} else {
			const newFilters = activeFilters.filter(
				(singleFilter) => !allDienstleistungenBranchen.includes(singleFilter),
			);
			setFilters([...newFilters, ...allDienstleistungenBranchen]);
		}
		return;
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div
			ref={dropdownRef}
			className={`relative inline-block filter-drop-down ${theme}`}
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="px-4 py-2 flex items-center gap-4"
				style={{
					borderBottomWidth: isOpen ? 0 : 2,
					marginBottom: isOpen ? 2 : 0,
				}}
			>
				<p className="bold select-none">Branche wählen</p>
				<div
					style={{
						transform: isOpen ? "rotate(180deg)" : "none",
					}}
				>
					<Icon
						id="chevron"
						size={fontSize}
						setColor={theme === "dark" ? colors.white : colors.blue}
					/>
				</div>
			</button>
			{isOpen && (
				<div className="absolute z-10">
					<ul className="overflow-y-auto p-2">
						<li
							className="flex items-center p-2 cursor-pointer"
							onClick={toggleAll}
						>
							<span className="mr-2">
								<Icon
									id={
										activeFilters.length === allFilters.length
											? "checked"
											: "unchecked"
									}
									size={fontSize}
								/>
							</span>
							<p className="bold select-none">Alle</p>
						</li>
						{sektoren.map((sektor) => (
							<li
								key={sektor.id}
								className="flex items-center p-2 cursor-pointer"
								onClick={() => toggleSektor(sektor.id)}
							>
								<span className="mr-2">
									<Icon
										id={
											checkForAllSektorChecked(sektor.id)
												? "checked"
												: "unchecked"
										}
										size={fontSize}
									/>
								</span>
								<p className="bold select-none">{sektor.name}</p>
							</li>
						))}

						<hr />

						{allFilters.map(
							(filter) =>
								filter && (
									<li
										key={filter}
										className="flex items-center p-2 cursor-pointer"
										onClick={() => toggleFilter(filter)}
									>
										<span className="mr-2">
											<Icon
												id={
													activeFilters.includes(filter)
														? "checked"
														: "unchecked"
												}
												size={fontSize}
											/>
										</span>
										<p className="line-clamp-1 break-words select-none">
											{branchen.find((branche) => branche.id === filter)
												?.name || filter}
										</p>
									</li>
								),
						)}
					</ul>
				</div>
			)}
		</div>
	);
};

export default FilterDropdown;
