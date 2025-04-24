import React, { useEffect, useRef, useState } from "react";
import wordings from "../../data/wordings.json";
import colors from "../../data/colors.json";
import branchen from "../../data/branchen.json";
import Icon from "../Icons";
import { useGlobalContext } from "../../GlobalContext";
import DataToggle from "../DataToggle";
import { Region } from "../../types/global";
import MatrixLabel1Dark from "../../assets/MatrixLabel1_dark.png";
import MatrixLabel1Light from "../../assets/MatrixLabel1_light.png";
import MatrixLabel2Dark from "../../assets/MatrixLabel2_dark.png";
import MatrixLabel2Light from "../../assets/MatrixLabel2_light.png";
import MatrixLabel3Dark from "../../assets/MatrixLabel3_dark.png";
import MatrixLabel3Light from "../../assets/MatrixLabel3_light.png";
import MatrixLabel4Dark from "../../assets/MatrixLabel4_dark.png";
import MatrixLabel4Light from "../../assets/MatrixLabel4_light.png";

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

const MatrixChart: React.FC<MatrixChartProps> = ({ data, id }) => {
	const { fontSize, theme, region, setRegion, isMobile } = useGlobalContext();
	const [maxValue, setMaxValue] = React.useState(0);
	const [minValue, setMinValue] = React.useState(0);
	const xLabels = data ? Array.from(new Set(data.map((d) => d.x))) : [];
	const yLabels = data ? Array.from(new Set(data.map((d) => d.y))) : [];

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
		return (
			<div
				ref={selfRef}
				className={`matrix-cell relative value-cell flex items-center justify-center ${theme}`}
				style={{ gridArea: `cell_${sanitize(x)}_${sanitize(y)}` }}
			>
				<div
					className={`inner-value-cell cursor-pointer flex items-center justify-center ${theme}`}
					onMouseEnter={() => setIsOpen(true)}
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
					>
						<div className="flex flex-col items-center">
							<p
								className="mb-4 bold"
								style={{
									color: theme === "dark" ? colors.dark : colors.white,
								}}
							>
								{branchen.find((findBranche: any) => findBranche.id === x)
									?.name || y.toUpperCase()}{" "}
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

	const setSRC = () => {
		if (id === "collaboration_regions") {
			return theme === "dark" ? MatrixLabel2Dark : MatrixLabel2Light;
		} else if (id === "collaboration_partners") {
			return theme === "dark" ? MatrixLabel1Dark : MatrixLabel1Light;
		} else if (id === "use_ai_processes") {
			return theme === "dark" ? MatrixLabel3Dark : MatrixLabel3Light;
		}
		// ai_applications
		return theme === "dark" ? MatrixLabel4Dark : MatrixLabel4Light;
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
			{isMobile && <img className="mb-2" src={setSRC()} />}
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
