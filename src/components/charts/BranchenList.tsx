import { CSSProperties } from "react";
import branchen from "@/data/branchen.json";
import sektoren from "@/data/sektoren.json";
import wordings from "@/data/wordings.json";
import { BranchenItem, Sektoren } from "@/types/global";
import Icon from "@/components/Icons";

const BranchenList = () => {
	const sektorenList = sektoren.map((sektor) => sektor.id) as Sektoren[];

	const DisplayBranche = ({ branche }: { branche: BranchenItem }) => {
		return (
			<div
				className="flex items-center gap-3 py-2 px-5 bg-[var(--bg)]"
				style={{ "--bg": branche.color } as CSSProperties}
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
			{sektorenList.map((sektor) => (
				<div key={sektor}>
					<h3 className="mb-2">{wordings[sektor]}</h3>
					<div className="flex flex-col lg:flex-row lg:flex-wrap gap-2">
						{branchen
							.filter((branche) => branche.sektor_id === sektor)
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
