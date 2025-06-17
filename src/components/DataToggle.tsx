import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../GlobalContext";
import colors from "../data/colors.json";
import wordings from "../data/wordings.json";

type DataToggleProps = {
	data: string;
	setData: (value: string) => void;
	allDatas: string[];
};

const DataToggle: React.FC<DataToggleProps> = ({ data, setData, allDatas }) => {
	const { theme, fontSize, widthOfStickyContainer, isMobile } =
		useGlobalContext();
	const horizontalPadding = fontSize * 4;
	const [widest, setWidest] = useState<number>(0);

	const getColor = (downData: string) => {
		if (theme === "dark") {
			if (downData === data) {
				return colors.dark;
			}
			return colors.white;
		}
		if (downData === data) {
			return colors.white;
		}
		return colors.blue;
	};
	const getWidthForDataToggle = () => {
		if (isMobile || !widest) {
			return "100%";
		}
		return widest * 2;
	};
	const getLeft = () => {
		if (data === allDatas[0]) {
			return 0;
		}
		if (isMobile) {
			return "50%";
		}
		return widest - 2;
	};

	const SingleToggleButton = ({ item }: { item: string }) => {
		const titleRef = useRef<HTMLParagraphElement>(null);
		const maxWidest = 275;
		useEffect(() => {
			if (titleRef.current) {
				if (isMobile) {
					return;
				}
				const width = titleRef.current.offsetWidth;
				if ((width + horizontalPadding) * 2 > widthOfStickyContainer) {
					const getWidth = widthOfStickyContainer / 2;
					if (getWidth > maxWidest) {
						setWidest(maxWidest);
					} else {
						setWidest(getWidth);
					}
				} else if (width + horizontalPadding > widest) {
					const getWidth = width + horizontalPadding;
					if (getWidth > maxWidest) {
						setWidest(maxWidest);
					} else {
						setWidest(getWidth);
					}
				}
			}
		}, [widthOfStickyContainer]);
		return (
			<div
				onClick={() => setData(item)}
				className="toggle-button flex items-center justify-center cursor-pointer"
				style={{ width: isMobile ? "50%" : widest }}
			>
				<p
					ref={titleRef}
					className="ignore bold line-clamp-1 text-center transform translate-y-[1.5px]"
					style={{
						color: getColor(item),
					}}
				>
					{item === "fue_intensitaet"
						? "FuE Intensität"
						: wordings[item as keyof typeof wordings]}
				</p>
			</div>
		);
	};

	return (
		<div
			className={`data-toggle flex ${theme}`}
			style={{ width: getWidthForDataToggle() }}
		>
			{allDatas.map((item, index) => (
				<SingleToggleButton key={index} item={item} />
			))}
			<div
				id="indicator"
				style={{
					width: isMobile ? "50%" : widest,
					left: getLeft(),
				}}
			/>
		</div>
	);
};

export default DataToggle;
