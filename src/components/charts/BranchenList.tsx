import React from "react";
import branchen from "../../data/branchen.json";
import colors from "../../data/colors.json";
import Icon from "../Icons";
import { useGlobalContext } from "../../GlobalContext";
import { BranchenItem } from "../../types/global";

const BranchenList: React.FC = () => {
	const { fontSize } = useGlobalContext();
	const DisplayBranche = ({ branche }: { branche: BranchenItem }) => {
		return (
			<div
				className="flex items-center gap-3 py-2 px-5"
				style={{ backgroundColor: branche.color }}
			>
				<Icon id={branche.id} setColor={colors.white} size={fontSize * 1.5} />
				<span className="line-clamp-1 break-words ignore white bold">
					{branche.name}
				</span>
			</div>
		);
	};
	return (
		<>
			<h3 className="mb-2">Industrie</h3>
			<div className="flex flex-wrap gap-2">
				{branchen
					.filter((branche) => branche.sektor_id === "industrie")
					.map((branche) => (
						<DisplayBranche key={branche.id} branche={branche} />
					))}
			</div>
			<h3 className="mt-8 mb-2">Dienstleistung</h3>
			<div className="flex flex-wrap gap-2">
				{branchen
					.filter((branche) => branche.sektor_id === "dienstleistungen")
					.map((branche) => (
						<DisplayBranche key={branche.id} branche={branche} />
					))}
			</div>
		</>
	);
};

export default BranchenList;
