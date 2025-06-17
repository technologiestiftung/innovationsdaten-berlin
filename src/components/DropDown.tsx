import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icons";
import colors from "../data/colors.json";
import branchen from "../data/branchen.json";
import sektoren from "../data/sektoren.json";
import wordings from "../data/wordings.json";
import { useGlobalContext } from "../GlobalContext";
import { dataKeys } from "../types/global";

interface DropdownProps {
	type: "filter" | "sort";
	allFilters?: string[];
	activeFilters?: string[] | null;
	setFilters?: React.Dispatch<React.SetStateAction<string[] | null>>;
	activeFilter?: string;
	setActiveFilter?: React.Dispatch<React.SetStateAction<string | null>>;
	sortsAfter?: dataKeys[];
	sortBy?: string | null;
	setSortBy?: (value: string | null) => void;
	chart_type?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
	type,
	allFilters,
	activeFilters,
	setFilters,
	activeFilter,
	setActiveFilter,
	sortsAfter,
	sortBy,
	setSortBy,
	chart_type,
}) => {
	const { theme, fontSize } = useGlobalContext();
	const [isOpen, setIsOpen] = useState(false);
	const [height, setHeight] = useState(0);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const baseRef = useRef<HTMLDivElement | null>(null);
	const allIndustrieBranchen: string[] = branchen
		.filter((branche) => branche.sektor_id === "industrie")
		.map((branche) => branche.id);
	const allDienstleistungenBranchen: string[] = branchen
		.filter((branche) => branche.sektor_id === "dienstleistungen")
		.map((branche) => branche.id);

	const setName = () => {
		if (type === "filter" && activeFilter === "industrie") {
			return "Industrie";
		} else if (type === "filter" && activeFilter === "dienstleistungen") {
			return "Dienstleistungen";
		} else if (type === "filter" && activeFilter === "finanz") {
			return "Finanzdienstleistungen";
		}
		if (wordings[activeFilter as keyof typeof wordings]) {
			return wordings[activeFilter as keyof typeof wordings];
		}
		if (
			type === "filter" &&
			branchen.find((branche) => branche.id === activeFilter)
		) {
			return branchen.find((branche) => branche.id === activeFilter)?.name;
		}
		if (type === "filter") {
			return "Branche wählen";
		}
		if (type === "sort" && sortBy) {
			return wordings[sortBy as keyof typeof wordings] || sortBy;
		}
		return "Sortieren nach";
	};

	const toggleFilter = (filter: string) => {
		if (typeof setActiveFilter === "function") {
			return setActiveFilter?.(filter);
		}
		const updatedFilters = activeFilters?.includes(filter)
			? activeFilters?.filter((f) => f !== filter)
			: [...(activeFilters || []), filter];
		if (setFilters) {
			return setFilters(updatedFilters);
		}
		return null;
	};

	const toggleAll = () => {
		if (!setFilters) {
			return;
		}
		if (activeFilters?.length === allFilters?.length) {
			setFilters([]);
		} else {
			setFilters(allFilters || []);
		}
		return;
	};

	const checkForAllSektorChecked = (id: string) => {
		let allSektorsChecked = true;
		branchen.forEach((branche) => {
			if (branche.sektor_id === id && !activeFilters?.includes(branche.id)) {
				allSektorsChecked = false;
			}
		});
		return allSektorsChecked;
	};

	const toggleSektor = (id: string) => {
		if (checkForAllSektorChecked(id)) {
			if (id === "industrie") {
				const newFilters = activeFilters?.filter(
					(singleFilter) => !allIndustrieBranchen.includes(singleFilter),
				);
				if (setFilters) {
					setFilters(newFilters || []);
				}
			} else {
				const newFilters = activeFilters?.filter(
					(singleFilter) => !allDienstleistungenBranchen.includes(singleFilter),
				);
				if (setFilters) {
					setFilters(newFilters || []);
				}
			}
			return;
		}
		if (id === "industrie") {
			const newFilters = activeFilters?.filter(
				(singleFilter) => !allIndustrieBranchen.includes(singleFilter),
			);
			if (setFilters) {
				setFilters([...(newFilters || []), ...allIndustrieBranchen]);
			}
		} else {
			const newFilters = activeFilters?.filter(
				(singleFilter) => !allDienstleistungenBranchen.includes(singleFilter),
			);
			if (setFilters) {
				setFilters([...(newFilters || []), ...allDienstleistungenBranchen]);
			}
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

	useEffect(() => {
		const el = baseRef.current;
		if (!el) {
			return;
		}

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const newHeight = entry.contentRect.height;
				setHeight(newHeight - 3);
			}
		});

		resizeObserver.observe(el);

		// eslint-disable-next-line consistent-return
		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div
			ref={dropdownRef}
			className={`relative inline-block drop-down ${theme}`}
		>
			<div
				className="flex items-center"
				style={{ gap: fontSize }}
				ref={baseRef}
			>
				<div className="flex-1">
					<Icon id={type} size={fontSize * 1.5} />
				</div>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="px-4 py-2 flex items-center gap-4 min-w-[210px] justify-between cursor-pointer"
				>
					<p className="bold select-none text-left first-letter:capitalize transform translate-y-[1.5px]">
						{setName()}
					</p>
					<div
						style={{
							transform: isOpen ? "none" : "rotate(180deg)",
						}}
					>
						<Icon
							id="chevron"
							size={fontSize}
							setColor={theme === "dark" ? colors.white : colors.blue}
						/>
					</div>
				</button>
			</div>
			{isOpen && (
				<div
					className="flyout absolute z-10"
					style={{
						width: `calc(100% - ${fontSize * 2.5}px)`,
						marginLeft: fontSize * 2.5,
						transform: `translateY(calc(-100% - ${height}px))`,
					}}
				>
					<ul className="overflow-y-auto px-2">
						{type === "filter" && (
							<>
								{!allFilters?.includes("insgesamt") && !chart_type && (
									<>
										<li
											className="flex items-center p-2 cursor-pointer"
											onClick={toggleAll}
										>
											<span className="mr-2">
												<Icon
													id={
														activeFilters?.length === allFilters?.length
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
									</>
								)}
								{allFilters?.map(
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
															activeFilters?.includes(filter) ||
															filter === activeFilter
																? "checked"
																: "unchecked"
														}
														size={fontSize}
													/>
												</span>
												<p className="line-clamp-1 break-words select-none first-letter:capitalize">
													{wordings[filter as keyof typeof wordings] ||
														branchen.find((branche) => branche.id === filter)
															?.name ||
														filter}
												</p>
											</li>
										),
								)}
							</>
						)}
						{type === "sort" && sortsAfter && (
							<>
								{sortsAfter.map((item: string) => (
									<li
										key={item}
										className="flex items-center p-2 cursor-pointer"
										onClick={() => {
											if (setSortBy) {
												setSortBy(item);
												setIsOpen(false);
											}
										}}
									>
										<span className="mr-2">
											<Icon
												id={sortBy === item ? "checked" : "unchecked"}
												size={fontSize}
											/>
										</span>
										{wordings[item as keyof typeof wordings] && (
											<p className="bold select-none line-clamp-1 break-words">
												{wordings[item as keyof typeof wordings]}
											</p>
										)}
									</li>
								))}
							</>
						)}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Dropdown;
