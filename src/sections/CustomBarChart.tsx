import sektoren from "../data/sektoren.json";
import ausgaben from "../data/inno-ausgaben.json";
import colors from "../data/colors.json";
import Icon from "../components/Icons";
import { useGlobalContext } from "../GlobalContext";
import React, { useEffect, useState } from "react";
import { formatNumber } from "../utilities";

type BranchenAusgaben = { "2023": number; "2022": number; delta: number };

type DataType = {
	id: string;
	name: string | undefined;
	color: string | undefined;
	branche: string | undefined;
	width: {
		2022: string;
		2023: string;
	};
	widthBreaksPoint: {
		2022: boolean;
		2023: boolean;
	};
} & BranchenAusgaben;

type SubGraphProps = {
	entry: any;
};

const CustomBarChart: React.FC = () => {
	const { fontSize } = useGlobalContext();

	const [data, setData] = useState<any[]>([]);
	const [type, setType] = useState<"delta" | "normal" | "intensity">("delta");

	// const [elementHeight, setElementHeight] = useState<number>(70);
	const elementHeight = 70;

	const percentageBreakPoint = 30;

	const minHeightOfBar = fontSize * 2.3;

	const calcWidth = (value: number) => {
		const maxValue = Math.max(
			...Object.values(ausgaben).map((s) => s["2023"] ?? 0),
		);
		return maxValue ? (value / maxValue) * 100 : 0;
	};

	const calcTransform = (index: number) => {
		return `translateY(${elementHeight * index}px)`;
	};

	const getWidth = (
		barWidthPositiveDelta: string,
		barWidthNegativeDelta: string,
		delta: number,
	) => {
		if (type === "normal") {
			return "100%";
		}
		if (delta > 0) {
			return barWidthPositiveDelta;
		}
		return barWidthNegativeDelta;
	};

	const initData = () => {
		const select = "2023";
		const collectData: DataType[] = [];
		sektoren.forEach((sektor) => {
			const findAusgaben = (ausgaben as Record<string, BranchenAusgaben>)[
				sektor.id
			] || { "2023": 0, "2022": 0, delta: 0 };
			collectData.push({
				...sektor,
				...findAusgaben,
				width: {
					2022: `${calcWidth(findAusgaben["2022"])}%`,
					2023: `${calcWidth(findAusgaben["2023"])}%`,
				},
				widthBreaksPoint: {
					2022: calcWidth(findAusgaben["2022"]) >= percentageBreakPoint,
					2023: calcWidth(findAusgaben["2023"]) >= percentageBreakPoint,
				},
			});
		});
		collectData.sort((a, b) => (b[select] ?? 0) - (a[select] ?? 0));
		setData(collectData);
	};

	const BigGraph: React.FC<SubGraphProps> = ({ entry }) => {
		const value2023 = entry["2023"];
		const width2023 = entry.width["2023"];
		const value2022 = entry["2022"];
		const delta = entry.delta;
		const barWidthPositiveDelta = `${(100 / value2023) * value2022}%`;
		const deltaWidthPositiveDelta = `${(100 / value2023) * delta}%`;
		const barWidthNegativeDelta = `${(100 / value2022) * value2023}%`;
		const deltaWidthNegativeDelta = `${100 - (100 / value2022) * value2023}%`;
		return (
			<div
				style={{
					width: width2023,
					minHeight: minHeightOfBar,
				}}
				className="bar flex"
			>
				<div
					className="bar flex justify-end items-center gap-2 pr-2"
					style={{
						background: entry.color,
						width: getWidth(
							barWidthPositiveDelta,
							barWidthNegativeDelta,
							delta,
						),
						minHeight: minHeightOfBar,
					}}
				>
					<p className="ignore white small">
						{formatNumber(type === "delta" ? value2022 : value2023)} Mio. €
					</p>
					<Icon id={entry.id} setColor={colors.white} size={fontSize} />
				</div>
				{type === "delta" && (
					<div
						className={`delta ${delta > 0 ? "positive" : "negative"}`}
						style={{
							width:
								delta > 0 ? deltaWidthPositiveDelta : deltaWidthNegativeDelta,
							height: minHeightOfBar,
						}}
					/>
				)}
			</div>
		);
	};
	const SmallGraph: React.FC<SubGraphProps> = ({ entry }) => {
		const value2023 = entry["2023"];
		const width2023 = entry.width["2023"];
		const value2022 = entry["2022"];
		const delta = entry.delta;
		const barWidthPositiveDelta = `${(100 / value2023) * value2022}%`;
		const deltaWidthPositiveDelta = `${(100 / value2023) * delta}%`;
		const barWidthNegativeDelta = `${(100 / value2022) * value2023}%`;
		const deltaWidthNegativeDelta = `${100 - (100 / value2022) * value2023}%`;
		return (
			<div
				className="flex items-center"
				style={{
					width: entry.widthBreaksPoint["2023"] ? entry.width["2023"] : "100%",
				}}
			>
				<div
					style={{
						width: width2023,
						minHeight: minHeightOfBar,
					}}
					className="bar flex"
				>
					<div
						className="bar"
						style={{
							background: entry.color,
							width: getWidth(
								barWidthPositiveDelta,
								barWidthNegativeDelta,
								delta,
							),
							minHeight: minHeightOfBar,
						}}
					/>
					{type === "delta" && (
						<div
							className={`delta ${delta > 0 ? "positive" : "negative"}`}
							style={{
								width:
									delta > 0 ? deltaWidthPositiveDelta : deltaWidthNegativeDelta,
								height: minHeightOfBar,
							}}
						/>
					)}
				</div>
				<p className="small mx-2">
					{formatNumber(type === "delta" ? value2022 : value2023)} Mio. €
				</p>
				<Icon id={entry.id} size={fontSize} />
			</div>
		);
	};

	useEffect(initData, []);

	return (
		<section id="treemap" className="mb-20">
			<h2 className="mb-4">Wie sahen die Innovations&shy;ausgaben 2022 aus?</h2>
			<p className="mb-4">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc iaculis
				malesuada nulla sit amet luctus. Suspendisse eget tellus orci. Aliquam
				sit amet viverra turpis. Maecenas facilisis eros at convallis vulputate.
				Ut ut posuere dolor. Fusce nec feugiat ipsum.
			</p>
			<p
				className="my-10"
				onClick={() =>
					type === "normal" ? setType("delta") : setType("normal")
				}
			>
				Toggle
			</p>
			<hr />
			<p className="mb-10 mt-2">
				*Innovationsausgaben in Mio. € 2022
				<br />
				delta 2023-2022 in rot oder grün
			</p>
			<div
				className="custom-bar-chart"
				style={{ height: elementHeight * data.length }}
			>
				{data.map((entry, index) => (
					<div
						key={entry.id}
						className="mb-4 bar-container w-full absolute"
						style={{
							transform: calcTransform(index),
						}}
					>
						<p className="bold mb-1 small">{entry.name}</p>
						{entry.widthBreaksPoint["2023"] ? (
							<BigGraph entry={entry} />
						) : (
							<SmallGraph entry={entry} />
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export default CustomBarChart;
