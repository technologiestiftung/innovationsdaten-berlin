import Icon from "../components/Icons";
import branchen from "../data/branchen.json";
import data from "../data/data.json";
import colors from "../data/colors.json";
import { useGlobalContext } from "../GlobalContext";
import React, { useEffect, useState } from "react";
import TreeMap from "../components/TreeMap";
import { StickyItem } from "../types/global";
import Card from "../components/Card";

const Branchen: React.FC = () => {
	const { fontSize, headerHeight } = useGlobalContext();
	const dataKey = "branchen";
	const dataArray = data[dataKey];
	const [current, setCurrent] = useState<StickyItem | null>(null);

	const BranchenList: React.FC = () => {
		return (
			<>
				<h3 className="mb-2">Industrie</h3>
				<div className="flex flex-wrap gap-2">
					{branchen
						.filter((branche) => branche.sektor_id === "industrie")
						.map((branche) => (
							<div
								key={branche.id}
								className="flex items-center gap-3 py-2 px-5"
								style={{ backgroundColor: branche.color }}
							>
								<Icon
									id={branche.id}
									setColor={colors.white}
									size={fontSize * 1.5}
								/>
								<p className="line-clamp-1 break-words ignore white bold">
									{branche.name}
								</p>
							</div>
						))}
				</div>
				<h3 className="mt-8 mb-2">Dienstleistung</h3>
				<div className="flex flex-wrap gap-2">
					{branchen
						.filter((branche) => branche.sektor_id === "dienstleistungen")
						.map((branche) => (
							<div
								key={branche.id}
								className="flex items-center gap-3 py-2 px-5"
								style={{ backgroundColor: branche.color }}
							>
								<Icon
									id={branche.id}
									setColor={colors.white}
									size={fontSize * 1.5}
								/>
								<p className="line-clamp-1 break-words ignore white bold">
									{branche.name}
								</p>
							</div>
						))}
				</div>
			</>
		);
	};

	useEffect(() => {
		if (dataArray.length > 0) {
			setCurrent(dataArray[0] as StickyItem);
		}
	}, [dataArray]);

	return (
		<section id={dataKey} className="sticky-section relative w-full flex gap-6">
			<div
				className="sticky flex items-center basis-3/5"
				style={{
					height: window.innerHeight - headerHeight,
					top: headerHeight,
				}}
			>
				<div className="w-full">
					{current?.id === "branchen-list" ? (
						<BranchenList />
					) : (
						<>
							<TreeMap data={current?.data} id={current?.id} />
							<div className="mt-2 pt-2 w-full flex justify-end">
								<p>{current?.unit}</p>
							</div>
						</>
					)}
				</div>
			</div>
			<div className="basis-2/5">
				{dataArray.map((item, index) => (
					<Card
						key={item.id}
						title={item.title}
						text={item.text}
						item={item}
						current={current}
						setCurrent={setCurrent}
						last={index === dataArray.length - 1}
					/>
				))}
			</div>
		</section>
	);
};

export default Branchen;
