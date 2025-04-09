import data from "../data/data.json";
import { useGlobalContext } from "../GlobalContext";
import React, { useEffect, useState } from "react";
import { ChapterKeys, StickyItem } from "../types/global";
import Card from "../components/Card";
import LeftStickyContent from "../components/LeftStickyContent";

type StickyProps = {
	dataKey: ChapterKeys;
};

const Sticky: React.FC<StickyProps> = ({ dataKey }) => {
	const { headerHeight, verticalAligment } = useGlobalContext();
	const typedData = data as Record<ChapterKeys, StickyItem[]>;
	const dataArray = typedData[dataKey];
	const [current, setCurrent] = useState<StickyItem | null>(null);

	useEffect(() => {
		if (dataArray) {
			setCurrent(dataArray[0] as StickyItem);
		}
	}, [dataArray]);

	return (
		<section
			id={dataKey}
			className="sticky-section relative w-full flex gap-6"
			style={{ paddingTop: headerHeight }}
		>
			<div
				className={`sticky flex items-center ${verticalAligment[0]} `}
				style={{
					height: window.innerHeight - headerHeight,
					top: headerHeight,
				}}
			>
				<div className="w-full">
					<LeftStickyContent data={current as StickyItem} />
				</div>
			</div>
			<div className={verticalAligment[1]}>
				{dataArray.map((item: StickyItem, index: number) => (
					<Card
						key={item.id}
						dataKey={dataKey}
						title={item.title}
						displayNumber={item.displayNumber}
						text={item.text}
						onSetCurrent={() => setCurrent(item as StickyItem)}
						isNotCurrent={item.id !== current?.id}
						last={index === dataArray.length - 1}
						first={!index}
					/>
				))}
			</div>
		</section>
	);
};

export default Sticky;
