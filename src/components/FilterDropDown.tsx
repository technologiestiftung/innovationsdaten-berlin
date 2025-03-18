import { useState } from "react";
import Icon from "./Icons";
import colors from "../data/colors.json";
import sektoren from "../data/sektoren.json";
import branchen from "../data/branchen.json";
import { useGlobalContext } from "../GlobalContext";

interface FilterDropdownProps {
	filterList: string[];
	filters: string[];
	onChange: (selectedFilters: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
	filterList,
	filters,
	onChange,
}) => {
	const { theme } = useGlobalContext();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedFilters, setSelectedFilters] = useState<string[]>(filters);

	const toggleFilter = (filter: string) => {
		const updatedFilters = selectedFilters.includes(filter)
			? selectedFilters.filter((f) => f !== filter)
			: [...selectedFilters, filter];

		setSelectedFilters(updatedFilters);
		onChange(updatedFilters);
	};

	const toggleAll = () => {
		if (selectedFilters.length === filters.length) {
			setSelectedFilters([]);
			onChange([]);
		} else {
			setSelectedFilters(filters);
			onChange(filters);
		}
	};
	const toggleBranche = (branche: any) => {
		console.log("", branche);
	};

	return (
		<div className={`relative inline-block filter-drop-down ${theme}`}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="px-4 py-2 flex items-center gap-4"
				style={{
					borderBottomWidth: isOpen ? 0 : 2,
					marginBottom: isOpen ? 2 : 0,
				}}
			>
				<p className="bold">Branche wählen</p>
				<div
					style={{
						transform: isOpen ? "rotate(180deg)" : "none",
					}}
				>
					<Icon
						id="chevron"
						size={16}
						setColor={theme === "dark" ? colors.white : colors.blue}
					/>
				</div>
			</button>
			{isOpen && (
				<div className="absolute z-10">
					<ul className="overflow-y-auto p-2">
						<li className="flex items-center p-2" onClick={toggleAll}>
							<input
								type="checkbox"
								checked={selectedFilters.length === filters.length}
								className="mr-2"
							/>
							<p className="bold">Alle</p>
						</li>

						{branchen.map((branche) => (
							<li
								key={branche.id}
								className="flex items-center p-2"
								onClick={() => toggleBranche(branche)}
							>
								<input
									type="checkbox"
									checked={selectedFilters.length === filters.length}
									className="mr-2"
								/>
								<p className="bold">{branche.name}</p>
							</li>
						))}

						<hr />

						{filterList.map((filter) => (
							<li
								key={filter}
								className="flex items-center p-2"
								onClick={() => toggleFilter(filter)}
							>
								<input
									type="checkbox"
									checked={!selectedFilters.includes(filter)}
									className="mr-2"
								></input>
								<p>{sektoren.find((sektor) => sektor.id === filter)?.name}</p>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default FilterDropdown;
