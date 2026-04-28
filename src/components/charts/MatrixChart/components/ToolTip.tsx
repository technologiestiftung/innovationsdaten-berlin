import React from "react";
import { useGlobalContext } from "@/GlobalContext";
import branchen from "@/data/branchen.json";
import wordings from "@/data/wordings.json";
import Icon from "@/components/Icons";
import { cn } from "@/utilities";

type TooltipProps = {
	x: string;
	y: string;
	value: number;
	yLabels: string[];
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Tooltip: React.FC<TooltipProps> = ({
	x,
	y,
	value,
	yLabels,
	setIsOpen,
}: TooltipProps) => {
	const { isMobile } = useGlobalContext();
	const getToolTipPosition = (yPosition: string) => {
		const findYLabelsIndex = yLabels.indexOf(yPosition);
		const halfway = yLabels.length / 2;
		return findYLabelsIndex < halfway
			? "lg:top-full lg:-translate-x-1/2 lg:translate-y-0"
			: "lg:top-0 lg:-translate-x-1/2 lg:-translate-y-full";
	};
	const getCorrectLabel = isMobile ? x : y;
	const getCorrectBranchenID = isMobile ? y : x;
	return (
		<div
			className={cn(
				"fixed top-[35vh] left-[calc((100vw-300px)/2+15px)] bg-foreground",
				"lg:absolute lg:left-[50%]",
				"p-4 z-[50] w-[300px] height-auto select-none",
				getToolTipPosition(y),
			)}
			onClick={() => {
				if (isMobile) {
					setIsOpen(false);
				}
			}}
		>
			<div className="flex flex-col items-center">
				<p className="mb-4 font-bold text-background">
					{branchen.find(
						(findBranche: any) => findBranche.id === getCorrectBranchenID,
					)?.name || y.toUpperCase()}{" "}
				</p>
				<Icon id="sort" className="size-6 fill-background" />
				<p
					className="my-4 font-bold text-background"
					dangerouslySetInnerHTML={{
						__html: wordings[getCorrectLabel as keyof typeof wordings],
					}}
				/>
			</div>
			<div className="w-full h-[2px] bg-background" />
			<div className="flex justify-between items-end gap-6 mt-4">
				{wordings[getCorrectLabel as keyof typeof wordings] && (
					<p
						className="text-left text-background"
						dangerouslySetInnerHTML={{
							__html: `${wordings[getCorrectLabel as keyof typeof wordings]}:`,
						}}
					/>
				)}
				<p className="font-bold min-w-[50px] text-background">{value} %</p>
			</div>
		</div>
	);
};

export default Tooltip;
