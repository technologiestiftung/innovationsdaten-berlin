import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icons";
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
}) => {
	const { theme } = useGlobalContext();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const allIndustrieBranchen: string[] = branchen
		.filter((branche) => branche.sektor_id === "industrie")
		.map((branche) => branche.id);
	const allDienstleistungenBranchen: string[] = branchen
		.filter((branche) => branche.sektor_id === "dienstleistungen")
		.map((branche) => branche.id);

	const setName = () => {
		if (
			type === "filter" &&
			allFilters?.includes("insgesamt") &&
			activeFilter
		) {
			return activeFilter;
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
		if (allFilters?.includes("insgesamt")) {
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

	return (
		<div
			ref={dropdownRef}
			className={`relative inline-block drop-down ${theme}`}
		>
			<div className="flex items-center gap-16">
				<div className="flex-1 size-24">
					<Icon id={type} />
				</div>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="px-4 py-2 flex items-center gap-4 min-w-[210px] justify-between"
				>
					<p className="bold select-none text-left first-letter:capitalize">
						{setName()}
					</p>
					<div className={`size-24 ${isOpen && "rotate-180"}`}>
						<Icon id="chevron" />
					</div>
				</button>
			</div>
			{isOpen && (
				<div
					className="flyout absolute z-10"
					// style={{
					// 	width: `calc(100% - ${fontSize * 2.5}px)`,
					// 	marginLeft: fontSize * 2.5,
					// }}
				>
					<ul className="overflow-y-auto px-2">
						{type === "filter" && (
							<>
								{!allFilters?.includes("insgesamt") && (
									<>
										<li
											className="flex items-center p-2 cursor-pointer"
											onClick={toggleAll}
										>
											<span className="mr-2 size-24">
												<Icon
													id={
														activeFilters?.length === allFilters?.length
															? "checked"
															: "unchecked"
													}
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
												<span className="mr-2 size-24">
													<Icon
														id={
															checkForAllSektorChecked(sektor.id)
																? "checked"
																: "unchecked"
														}
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
												<span className="mr-2 size-14">
													<Icon
														id={
															activeFilters?.includes(filter) ||
															filter === activeFilter
																? "checked"
																: "unchecked"
														}
													/>
												</span>
												<p className="line-clamp-1 break-words select-none first-letter:capitalize">
													{branchen.find((branche) => branche.id === filter)
														?.name || filter}
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
										<span className="mr-2 size-24">
											<Icon id={sortBy === item ? "checked" : "unchecked"} />
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
