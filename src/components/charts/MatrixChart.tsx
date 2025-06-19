import React, { useEffect, useRef, useState } from "react";
import wordings from "../../data/wordings.json";
import colors from "../../data/colors.json";
import branchen from "../../data/branchen.json";
import Icon from "../Icons";
import { useGlobalContext } from "../../GlobalContext";
import DataToggle from "../DataToggle";
import { Region } from "../../types/global";

type MatrixData = {
	x: string;
	y: string;
	value: number;
}[];

type MatrixChartProps = {
	id: string;
	data: MatrixData;
};

const sanitize = (str: string) =>
	str
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/[^a-z0-9_]/g, "");

function replaceAllCustom(input: string) {
	if (!input) {
		return input;
	}
	return input
		.replace(/<br\s*\/?>/gi, " ") // replace all <br>, <br/>, <br /> with space
		.replace(/&shy;/gi, ""); // remove all &shy;
}

function getMinMax(data: MatrixData): { min: number; max: number } {
	if (data.length === 0) {
		throw new Error("Data array is empty");
	}

	let min = data[0].value;
	let max = data[0].value;

	for (const { value } of data) {
		if (value < min) {
			min = value;
		}
		if (value > max) {
			max = value;
		}
	}

	return { min, max };
}

const MatrixChart: React.FC<MatrixChartProps> = ({ data }) => {
	const { fontSize, theme, region, setRegion, isMobile } = useGlobalContext();
	const [maxValue, setMaxValue] = useState(0);
	const [minValue, setMinValue] = useState(0);
	const [cellSize, setCellSize] = useState(0);
	const xLabels = data ? Array.from(new Set(data.map((d) => d.x))) : [];
	const yLabels = data ? Array.from(new Set(data.map((d) => d.y))) : [];
	const numberOfColumns = xLabels.length;

	const templateAreas = [
		[".", ...xLabels.map((x) => `x_${sanitize(x)}`)],
		...yLabels.map((y) => [
			`y_${sanitize(y)}`,
			...xLabels.map((x) => `cell_${sanitize(x)}_${sanitize(y)}`),
		]),
	]
		.map((row) => `"${row.join(" ")}"`)
		.join("\n");

	const getWidth = (self: number) => {
		return `${((self - minValue) / (maxValue - minValue)) * 100}%`;
	};

	const ValueCell = ({
		x,
		y,
		value,
	}: {
		x: string;
		y: string;
		value: number;
		index: number;
	}) => {
		const [isOpen, setIsOpen] = useState(false);
		const selfRef = useRef<HTMLDivElement>(null);
		const getCorrectLabel = isMobile ? x : y;
		const getCorrectBranchenID = isMobile ? y : x;
		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					selfRef.current &&
					!selfRef.current.contains(event.target as Node)
				) {
					setIsOpen(false);
				}
			};
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}, []);
		useEffect(() => {
			window.addEventListener("scroll", () => setIsOpen(false));
			return () => {
				window.removeEventListener("scroll", () => setIsOpen(false));
			};
		}, []);
		useEffect(() => {
			if (selfRef.current && !cellSize) {
				const matrixCellSize = selfRef.current.getBoundingClientRect().height;
				setCellSize(matrixCellSize);
			}
		}, []);
		return (
			<div
				ref={selfRef}
				className={`matrix-cell relative value-cell flex items-center justify-center ${theme}`}
				style={{ gridArea: `cell_${sanitize(x)}_${sanitize(y)}` }}
			>
				<div
					className={`inner-value-cell cursor-pointer flex items-center justify-center ${theme}`}
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
						className={`inner-value-cell-child ${theme}`}
						style={{ width: getWidth(value) }}
					/>
				</div>
				{isOpen && (
					<div
						className={`tooltip p-4 select-none ${theme} ${y === "own_region" || y === "different_regions_in_germany" || y === "eu_foreign" ? "below" : "above"}`}
						onClick={() => {
							if (isMobile) {
								setIsOpen(false);
							}
						}}
					>
						<div className="flex flex-col items-center">
							<p
								className="mb-4 bold"
								style={{
									color: theme === "dark" ? colors.dark : colors.white,
								}}
							>
								{branchen.find(
									(findBranche: any) => findBranche.id === getCorrectBranchenID,
								)?.name || y.toUpperCase()}{" "}
							</p>
							<Icon
								id="sort"
								size={fontSize * 1.5}
								setColor={theme === "dark" ? colors.dark : colors.white}
							/>
							<p
								className="my-4 bold"
								style={{
									color: theme === "dark" ? colors.dark : colors.white,
								}}
								dangerouslySetInnerHTML={{
									__html: wordings[getCorrectLabel as keyof typeof wordings],
								}}
							/>
						</div>
						<div className="placeholder w-full" />
						<div className="flex justify-between items-end gap-6 mt-4">
							{wordings[getCorrectLabel as keyof typeof wordings] && (
								<p
									className="text-left"
									style={{
										color: theme === "dark" ? colors.dark : colors.white,
									}}
									dangerouslySetInnerHTML={{
										__html: `${wordings[getCorrectLabel as keyof typeof wordings]}:`,
									}}
								/>
							)}
							<p
								className="bold min-w-[50px]"
								style={{
									color: theme === "dark" ? colors.dark : colors.white,
								}}
							>
								{value} %
							</p>
						</div>
					</div>
				)}
			</div>
		);
	};

	useEffect(() => {
		if (data) {
			const { min, max } = getMinMax(data);
			setMinValue(min);
			setMaxValue(max);
		}
	}, [data]);

	if (!data) {
		return <h4>Matrix Chart Data missing</h4>;
	}

	return (
		<>
			<div className="flex w-full justify-end pb-4 mt-[-10vh]">
				<div
					className="rotate-90"
					style={{ width: cellSize * numberOfColumns }}
				>
					{xLabels.reverse().map((x) => (
						<div
							key={x}
							className="flex items-center justify-end"
							style={{ height: cellSize }}
						>
							<p className="rotate-[-25deg] origin-right small">
								{replaceAllCustom(wordings[x as keyof typeof wordings])}
							</p>
						</div>
					))}
				</div>
			</div>
			<div
				className={`matrix-grid ${theme}`}
				style={{
					display: "grid",
					gridTemplateAreas: templateAreas,
				}}
			>
				{/* X Labels */}
				{!isMobile && (
					<>
						{xLabels.map((x) => (
							<div
								key={x}
								className={`matrix-cell label-x ${isMobile ? "" : "flex items-center justify-center"}`}
								style={{ gridArea: `x_${sanitize(x)}` }}
							>
								<Icon
									id={x}
									setColor={theme === "dark" ? colors.white : colors.blue}
									size={fontSize * 1.25}
								/>
							</div>
						))}
					</>
				)}

				{/* Y Labels */}
				{yLabels.map((y) => (
					<div
						key={y}
						className={`matrix-cell label-y flex items-center ${isMobile ? "" : ""}`}
						style={{ gridArea: `y_${sanitize(y)}` }}
					>
						{isMobile ? (
							<Icon
								id={y}
								setColor={theme === "dark" ? colors.white : colors.blue}
								size={fontSize * 1.25}
							/>
						) : (
							<p
								className="small"
								dangerouslySetInnerHTML={{
									__html: wordings[y as keyof typeof wordings],
								}}
							/>
						)}
					</div>
				))}

				{/* Values */}
				{data.map(({ x, y, value }, index) => (
					<ValueCell
						key={`${x}-${y}`}
						x={x}
						y={y}
						value={value}
						index={index}
					/>
				))}
			</div>
			<div className="mt-8 flex gap-8 items-center justify-end">
				<DataToggle
					data={region}
					setData={(value: string) => setRegion(value as Region)}
					allDatas={["ber", "de"]}
				/>
			</div>
		</>
	);
};

export default MatrixChart;
