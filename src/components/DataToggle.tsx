import React from "react";
import wordings from "../data/wordings.json";
import { cn } from "../utilities";
import { useGlobalContext } from "../GlobalContext";

type DataToggleProps = {
	data: string;
	setData: (value: string) => void;
	allDatas: string[];
	togglesBetween?: boolean;
};

const DataToggle: React.FC<DataToggleProps> = ({
	data,
	setData,
	allDatas,
	togglesBetween,
}) => {
	const { animationDuration } = useGlobalContext();
	const SingleToggleButton = ({ item }: { item: string }) => {
		return (
			<div
				onClick={() => setData(item)}
				className={cn(
					"flex items-center justify-center cursor-pointer z-[2] h-[--options-height] w-[50%]",
					togglesBetween
						? "lg:w-[calc(var(--toggle-width)*1.5)]"
						: "lg:w-[var(--toggle-width)]",
				)}
			>
				<p
					className={cn(
						"font-bold text-center",
						item === data ? "text-background" : "text-foreground",
					)}
				>
					{item === "fue_intensitaet"
						? wordings.fue_intensitaet_short
						: wordings[item as keyof typeof wordings]}
				</p>
			</div>
		);
	};

	return (
		<div
			className={cn(
				// measures
				"w-full  h-[calc(var(--options-height)+4px)]",
				togglesBetween
					? "lg:w-[calc(var(--toggle-width)*1.5*2)]"
					: "lg:w-[calc(var(--toggle-width)*2)]",
				// position
				"relative",
				// layout
				"flex",
				// borders
				"border-2 border-foreground",
			)}
		>
			{allDatas.map((item, index) => (
				<SingleToggleButton key={index} item={item} />
			))}
			<div
				className={cn(
					// measures
					"h-[calc(var(--options-height)+2px)] w-[50%]",
					togglesBetween
						? "lg:w-[calc(var(--toggle-width)*1.5)]"
						: "lg:w-[var(--toggle-width)]",
					// position
					"absolute left-0 -top-[1px]",
					data !== allDatas[0] && "left-[calc(50%+1px)]",
					// animation
					"transition-all duration-[var(--duration)] ease-in-out",
					// rest
					"bg-foreground",
				)}
				style={
					{ "--duration": `${animationDuration}ms` } as React.CSSProperties
				}
			/>
		</div>
	);
};

export default DataToggle;
