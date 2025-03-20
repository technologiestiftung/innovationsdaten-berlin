import sektoren from "../data/sektoren.json";
import ausgaben from "../data/inno-ausgaben.json";
import innointensitaet from "../data/inno-intensitaet.json";
import colors from "../data/colors.json";
import Icon from "../components/Icons";
import { useGlobalContext } from "../GlobalContext";
import React, { useEffect, useState } from "react";
import { formatNumber } from "../utilities";

type BarChartProps = {
	chart: {
		id: string;
		title: string;
		text: string;
		bar_chart_type: string;
		legend: string;
	};
};

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

type DataTypeIntensitaet = {
	id: string;
	name: string | undefined;
	color: string | undefined;
	branche: string | undefined;
	value: number;
};

type SubGraphProps = {
	entry: any;
};

const BarChart: React.FC<BarChartProps> = ({ chart }) => {
	const { title, text, bar_chart_type, legend, id } = chart;
	const { fontSize, isMobile } = useGlobalContext();

	const [data, setData] = useState<any[]>([]);

	// const [elementHeight, setElementHeight] = useState<number>(70);
	const elementHeight = 70;
	const deltaDisplayType = "delta"; // delta-imgs

	const testingSegments = [
		{ percentage: 20, color: colors.cyan_light },
		{ percentage: 30, color: colors.green_light },
		{ percentage: 50, color: colors.blue },
	];

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

	const getGradient = (segments: { percentage: number; color: string }[]) => {
		let gradientString = "linear-gradient(to right, ";
		let accumulatedPercentage = 0;
		segments.forEach((segment, index) => {
			const nextPercentage = accumulatedPercentage + segment.percentage;
			gradientString += `${segment.color} ${accumulatedPercentage}%, ${segment.color} ${nextPercentage}%`;
			if (index < segments.length - 1) gradientString += ", ";
			accumulatedPercentage = nextPercentage;
		});
		gradientString += ")";
		return gradientString;
	};

	const getWidth = (
		barWidthPositiveDelta: string,
		barWidthNegativeDelta: string,
		delta: number,
	) => {
		if (bar_chart_type === "normal") {
			return "100%";
		}
		if (delta > 0) {
			return barWidthPositiveDelta;
		}
		return barWidthNegativeDelta;
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
						background:
							bar_chart_type === "shares"
								? getGradient(testingSegments)
								: entry.color,
						width: getWidth(
							barWidthPositiveDelta,
							barWidthNegativeDelta,
							delta,
						),
						minHeight: minHeightOfBar,
					}}
				>
					<p className={`ignore white ${isMobile ? "small" : ""}`}>
						{formatNumber(bar_chart_type === "delta" ? value2022 : value2023)}{" "}
						Mio. €
					</p>
					<Icon id={entry.id} setColor={colors.white} size={fontSize} />
				</div>
				{bar_chart_type === "delta" && (
					<div
						className={`${deltaDisplayType} ${delta > 0 ? "positive" : "negative"}`}
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
							background:
								bar_chart_type === "shares"
									? getGradient(testingSegments)
									: entry.color,
							width: getWidth(
								barWidthPositiveDelta,
								barWidthNegativeDelta,
								delta,
							),
							minHeight: minHeightOfBar,
						}}
					/>
					{bar_chart_type === "delta" && (
						<div
							className={`${deltaDisplayType} ${delta > 0 ? "positive" : "negative"}`}
							style={{
								width:
									delta > 0 ? deltaWidthPositiveDelta : deltaWidthNegativeDelta,
								height: minHeightOfBar,
							}}
						/>
					)}
				</div>
				<p className={`mx-2 ${isMobile ? "small" : ""}`}>
					{formatNumber(bar_chart_type === "delta" ? value2022 : value2023)}{" "}
					Mio. €
				</p>
				<Icon id={entry.id} size={fontSize} />
			</div>
		);
	};

	const initData = () => {
		const select = "2023";
		if (id.includes("intensitaet")) {
			const collectData: DataTypeIntensitaet[] = [];
			const innoIntensitaet: Record<string, number> = innointensitaet;
			sektoren.forEach((sektor) => {
				let findValue = innoIntensitaet[sektor.id];
				collectData.push({
					...sektor,
					value: findValue,
				});
			});
			console.log("collectData :>> ", collectData);
			collectData.sort((a, b) => b.value - a.value);
		} else {
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
		}
	};

	useEffect(initData, []);

	return (
		<section id={`treemap-${id}`} className="mb-20">
			<h2 className="mb-4" dangerouslySetInnerHTML={{ __html: title }} />
			<p className="mb-4"> {text}</p>
			<hr className="mt-10" />
			<p className="mb-10 mt-2" dangerouslySetInnerHTML={{ __html: legend }} />
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
						<p className={`bold mb-1 ${isMobile ? "small" : ""}`}>
							{entry.name}
						</p>
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

export default BarChart;
