import React, { CSSProperties, useEffect, useRef, useState } from "react";
import wordings from "@/data/wordings.json";
import Icon from "@/components/Icons";
import { useGlobalContext } from "@/GlobalContext";
import DataToggle from "@/components/DataToggle";
import { ChapterItem, MatrixData, Region } from "@/types/global";
import { replaceAllCustom, sanitize } from "./utils";
import CellWrapper from "./components/CellWrapper";

const MatrixChart: React.FC<ChapterItem> = ({ chartData, id }) => {
	const { region, setRegion, isMobile } = useGlobalContext();

	const rawMatrixData =
		!Array.isArray(chartData) &&
		typeof chartData === "object" &&
		region in chartData
			? chartData[region as keyof typeof chartData]
			: chartData;

	if (!Array.isArray(rawMatrixData)) {
		return null;
	}

	const matrixData = rawMatrixData as MatrixData[];

	const [cellSize, setCellSize] = useState(0);
	const gridRef = useRef<HTMLDivElement>(null);
	const xLabels = Array.from(
		new Set(matrixData.map((d) => (isMobile ? d.y : d.x))),
	);
	const yLabels = Array.from(
		new Set(matrixData.map((d) => (isMobile ? d.x : d.y))),
	);
	const numberOfColumns = xLabels.length;
	const numberOfRows = yLabels.length;

	const templateAreas = [
		[".", ...xLabels.map((x) => `x_${sanitize(x)}`)],
		...yLabels.map((y) => [
			`y_${sanitize(y)}`,
			...xLabels.map((x) => `cell_${sanitize(x)}_${sanitize(y)}`),
		]),
	]
		.map((row) => `"${row.join(" ")}"`)
		.join("\n");

	const getAndSetCellSize = () => {
		const firstValueCell = gridRef.current?.querySelector('[id^="cell_"]');
		if (firstValueCell) {
			const heightOfFirstValueCell =
				firstValueCell.getBoundingClientRect().height;
			if (heightOfFirstValueCell) {
				setCellSize(heightOfFirstValueCell);
			}
		}
	};

	useEffect(() => getAndSetCellSize(), [id, chartData]);
	useEffect(() => {
		window.addEventListener("resize", () => getAndSetCellSize());
		return () => window.removeEventListener("resize", getAndSetCellSize);
	}, []);

	return (
		<>
			{isMobile && (
				<div className="flex w-full justify-end pb-4">
					<div
						className="rotate-90 w-[var(--labels-width)]"
						style={
							{
								"--labels-width": `${cellSize * numberOfColumns}px`,
							} as CSSProperties
						}
					>
						{xLabels.reverse().map((x) => (
							<div
								key={x}
								className="flex items-center justify-end h-[var(--labels-height)]"
								style={
									{
										"--labels-height": `${cellSize}px`,
									} as CSSProperties
								}
							>
								<p className="rotate-[-15deg] origin-right text-[12px] leading-[14.4px]">
									{replaceAllCustom(wordings[x as keyof typeof wordings])}
								</p>
							</div>
						))}
					</div>
				</div>
			)}
			<div
				ref={gridRef}
				className="grid max-lg:grid-cols-[30px_repeat(auto-fit,minmax(0,1fr))] max-lg:w-full relative [grid-template-areas:var(--areas)]"
				style={
					{
						"--areas": templateAreas,
					} as CSSProperties
				}
			>
				{/* X Labels */}
				{!isMobile && (
					<>
						{xLabels.map((x) => (
							<div
								key={x}
								className="label-x lg:flex lg:items-center lg:justify-center lg:min-h-[30px] lg:pb-2 [grid-area:var(--area)]"
								style={
									{
										"--area": `x_${sanitize(x)}`,
									} as CSSProperties
								}
							>
								<Icon id={x} className="size-5 text-foreground" />
							</div>
						))}
					</>
				)}

				{/* Y Labels */}
				{yLabels.map((y) => (
					<div
						key={y}
						className="label-y flex items-center [grid-area:var(--area)]"
						style={
							{
								"--area": `y_${sanitize(y)}`,
							} as CSSProperties
						}
					>
						{isMobile ? (
							<Icon id={y} className="size-5 text-foreground" />
						) : (
							<p
								className="text-[12px] leading-[14.4px]"
								dangerouslySetInnerHTML={{
									__html: wordings[y as keyof typeof wordings],
								}}
							/>
						)}
					</div>
				))}

				{/* Values */}
				<CellWrapper data={matrixData} yLabels={yLabels} />
				{/* Matrix Border */}
				<div
					className="w-[var(--w)] h-[var(--h)] border-2 border-grey absolute right-0 bottom-0 max-xl:hidden pointer-events-none"
					style={
						{
							"--w": `${cellSize * numberOfColumns}px`,
							"--h": `${cellSize * numberOfRows}px`,
						} as CSSProperties
					}
				/>
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
