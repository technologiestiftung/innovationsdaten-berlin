/* eslint-disable */

import branchen from "../data/branchen.json";
import colors from "../data/colors.json";
import Icon from "../components/Icons";
import { useGlobalContext } from "../GlobalContext";
import React, { useState } from "react";
import { formatNumber } from "../utilities";

type DataType = {
	value: number;
	delta: string;
	segments: {
		percentage: number;
		color: string;
	}[];
};
type BarProps = {
	entry: {
		id: string;
		name: string;
		color: string;
		sektor: string;
		sektor_id: string;
		width: number;
	} & DataType;
};
type SingleBarProps = {
	downKey: string;
};
type BarChartProps = {
	chart: {
		id: string;
		title: string;
		text: string;
		legend: string;
		bar_chart_type: string;
		unit: string;
		data: {
			[key: string]: DataType;
		};
	};
};

const BarChart: React.FC<BarChartProps> = ({ chart }) => {
	const {
		id,
		title,
		text,
		legend,
		bar_chart_type,
		unit,
		data: chartData,
	} = chart;
	const { fontSize } = useGlobalContext();

	//
	// Fixed Values
	//
	const elementHeight = 75;
	// const [elementHeight, setElementHeight] = useState<number>(70);
	const percentageBreakPoint = 30;
	const keys = Object.keys(chartData);
	const minHeightOfBar = fontSize * 2.3;

	//
	// Utilities
	//
	const calcTransform = (index: number) => {
		return `translateY(${elementHeight * index}px)`;
	};
	const calcWidth = (value: number) => {
		const maxValue = Math.max(...Object.values(chartData).map((s) => s.value));
		return maxValue ? (value / maxValue) * 100 : 0;
	};
	const getBackground = (color: string) => {
		if (bar_chart_type === "normal") {
			return color;
		}
		return color;
		/* bar_chart_type === "delta"
                            ? colors.dark
                            : bar_chart_type === "shares"
                                ? getGradient(testingSegments)
                                :  */
	};
	const getGradient = (segments: { percentage: number; color: string }[]) => {
		let gradientString = "linear-gradient(to right, ";
		let accumulatedPercentage = 0;
		segments.forEach((segment, index) => {
			const nextPercentage = accumulatedPercentage + segment.percentage;
			gradientString += `${segment.color} ${accumulatedPercentage}%, ${segment.color} ${nextPercentage}%`;
			if (index < segments.length - 1) {
				gradientString += ", ";
			}
			accumulatedPercentage = nextPercentage;
		});
		gradientString += ")";
		return gradientString;
	};

	//
	// Sub Components
	//
	const BigGraph: React.FC<BarProps> = ({ entry }) => {
		const { value, width, id: graphID, segments } = entry;
		console.log("entry in BigGraph :>> ", entry);
		return (
			<div
				style={{
					width: "100%",
					minHeight: minHeightOfBar,
				}}
				className="bar flex"
			>
				<div
					className="bar flex justify-end items-center gap-2 pr-2"
					style={{
						background: getGradient(segments),
						width: `${width}%`,
						minHeight: minHeightOfBar,
					}}
				>
					<p className="ignore white line-clamp-1">
						{formatNumber(value)} {unit}
					</p>
					<Icon id={graphID} setColor={colors.white} size={fontSize} />
				</div>
				{/* {bar_chart_type === "delta" && (
					<div
						className={`delta ${delta > 0 ? "positive" : "negative"}`}
						style={{
							width:
								delta > 0 ? deltaWidthPositiveDelta : deltaWidthNegativeDelta,
							height: minHeightOfBar,
						}}
					/>
				)} */}
			</div>
		);
	};
	const SmallGraph: React.FC<BarProps> = ({ entry }) => {
		const { value, color, width, id } = entry;
		return (
			<div className="flex items-center w-full">
				<div
					style={{
						width: `${width}%`,
						minHeight: minHeightOfBar,
					}}
					className="bar flex"
				>
					<div
						className="bar w-full"
						style={{
							background: getBackground(color),
							// width: `100%`,
							/* width: getWidth(
								barWidthPositiveDelta,
								barWidthNegativeDelta,
								delta,
							), */
							minHeight: minHeightOfBar,
						}}
					/>
					{/* {bar_chart_type === "delta" && (
						<div
							className={`delta ${delta > 0 ? "positive" : "negative"}`}
							style={{
								width:
									delta > 0 ? deltaWidthPositiveDelta : deltaWidthNegativeDelta,
								height: minHeightOfBar,
							}}
						/>
					)} */}
				</div>
				<p className="mx-2">
					{formatNumber(rawValue)} {unit}
				</p>
				<Icon id={id} size={fontSize} />
			</div>
		);
	};

	const SingleBar: React.FC<SingleBarProps> = ({ downKey }) => {
		const value = chartData[downKey].value;
		const branche = branchen.find((branche) => branche.id === downKey);
		if (!branche) {
			return <p>Branchen not found</p>;
		}
		const width = calcWidth(value);
		const entry = {
			...branche,
			value,
			width,
		};
		console.log("entry :>> ", entry);
		return (
			<>
				<p className="bold mb-1 line-clamp-1">{branche.name}</p>
				{width > percentageBreakPoint ? (
					<BigGraph entry={entry} />
				) : (
					<>{/* <SmallGraph entry={entry} /> */}</>
				)}
			</>
		);
	};

	/* 






    REFACTORED

    */

	const [data, setData] = useState<any[]>([]);

	const testingSegments = [
		{ percentage: 20, color: colors.cyan_light },
		{ percentage: 30, color: colors.green_light },
		{ percentage: 50, color: colors.blue },
	];

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

	const initData = () => {
		console.log("chart :>> ", chart);
	};

	// useEffect(initData, []);

	return (
		<section id={`bar-chart-${id}`} className="mb-20 py-14">
			<h2 className="mb-4" dangerouslySetInnerHTML={{ __html: title }} />
			<p className="mb-4"> {text}</p>
			<hr className="mt-10" />
			<p className="mb-10 mt-2" dangerouslySetInnerHTML={{ __html: legend }} />
			<div
				className="custom-bar-chart"
				style={{ height: elementHeight * keys.length }}
			>
				{keys.map((key, index) => (
					<div
						key={key}
						className="mb-4 bar-container w-full absolute"
						style={{
							transform: calcTransform(index),
						}}
					>
						<SingleBar downKey={key} />
					</div>
				))}
			</div>
		</section>
	);
};

export default BarChart;
