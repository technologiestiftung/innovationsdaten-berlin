import React from "react";
import branchen from "../../data/branchen.json";
import wordings from "../../data/wordings.json";
import Icon from "../Icons";
import { BranchenItem } from "../../types/global";

const BranchenList: React.FC = () => {
	const lists = ["industrie", "dienstleistungen"] as const;

	const DisplayBranche = ({ branche }: { branche: BranchenItem }) => {
		return (
			<div
				className="flex items-center gap-3 py-2 px-5 bg-[var(--bg)]"
				style={{ "--bg": branche.color } as React.CSSProperties}
			>
				<Icon id={branche.id} className="size-6 text-white" />
				<p className="line-clamp-1 break-words font-bold text-white">
					{branche.name}
				</p>
			</div>
		);
	};
	return (
		<div className="flex flex-col gap-8">
			{lists.map((item) => (
				<div key={item}>
					<h3 className="mb-2">{wordings[item]}</h3>
					<div className="flex flex-col lg:flex-row lg:flex-wrap gap-2">
						{branchen
							.filter((branche) => branche.sektor_id === item)
							.map((branche) => (
								<DisplayBranche key={branche.id} branche={branche} />
							))}
					</div>
				</div>
			))}
		</div>
	);
};

export default BranchenList;
