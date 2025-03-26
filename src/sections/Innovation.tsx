import React, { useEffect, useState } from "react";
import data from "../data.json";
import { useGlobalContext } from "../GlobalContext";
import { StickyItem } from "../types/global";
import Card from "../components/Card";
import AreaChart from "../components/AreaChart";

const Innovation: React.FC = () => {
	const { headerHeight } = useGlobalContext();
	const dataKey = "who_innovates";
	const dataArray = data[dataKey];
	const [current, setCurrent] = useState<StickyItem | null>(null);

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
					<AreaChart id={current?.id} data={current?.data} />
					<div className="mt-2 pt-2 w-full flex justify-end">
						<p>{current?.unit}</p>
					</div>
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

export default Innovation;
