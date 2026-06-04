import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/GlobalContext";
import ToolTip from "./ToolTip";
import { sanitize } from "@/components/charts/MatrixChart/utils";

type CellProps = {
	x: string;
	y: string;
	value: number;
	minValue: number;
	maxValue: number;
	yLabels: string[];
};

const Cell: React.FC<CellProps> = ({
	x,
	y,
	value,
	minValue,
	maxValue,
	yLabels,
}: CellProps) => {
	const { isMobile } = useGlobalContext();
	const [isOpen, setIsOpen] = useState(false);
	const selfRef = useRef<HTMLDivElement>(null);

	const id = `cell_${sanitize(x)}_${sanitize(y)}`;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selfRef.current && !selfRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	useEffect(() => {
		window.addEventListener("scroll", () => setIsOpen(false));
		return () => {
			window.removeEventListener("scroll", () => setIsOpen(false));
		};
	}, []);
	return (
		<div
			ref={selfRef}
			id={id}
			className="relative text-center flex items-center justify-center [grid-area:var(--area)]"
			style={
				{
					"--area": id,
				} as CSSProperties
			}
		>
			<div
				className="w-full aspect-[1/1] border-1 border-grey hover:bg-grey cursor-pointer flex items-center justify-center"
				onMouseEnter={() => {
					if (!isMobile) {
						setIsOpen(true);
					}
				}}
				onMouseLeave={() => {
					if (!isMobile) {
						setIsOpen(false);
					}
				}}
				onClick={() => setIsOpen(true)}
			>
				<div
					className="aspect-[1/1] bg-foreground w-[var(--w)]"
					style={
						{
							"--w": `${((value - minValue) / (maxValue - minValue)) * 100}%`,
						} as CSSProperties
					}
				/>
			</div>
			{isOpen && (
				<ToolTip
					x={x}
					y={y}
					value={value}
					yLabels={yLabels}
					setIsOpen={setIsOpen}
				/>
			)}
		</div>
	);
};

export default Cell;
