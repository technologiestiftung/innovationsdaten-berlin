import {
	ResponsiveContainer,
	Tooltip,
	Treemap as TreeMapRecharts,
} from "recharts";
import sektoren from "../data/sektoren.json";
import treemaps from "../data/treemaps.json";
import colors from "../data/colors.json";
import Icon from "../components/Icons";
import { useGlobalContext } from "../GlobalContext";
import { formatNumber } from "../utilities";
import React from "react";

const TreeMap: React.FC = () => {
	const { theme, fontSize } = useGlobalContext();

	const CustomTreemapNode = (props: any) => {
		const { x, y, width, height, id, color } = props;
		const getIconSize = () => {
			if (window.innerWidth >= 900) {
				return fontSize * 2;
			}
			if (height <= fontSize) {
				return height - 4;
			}
			return fontSize;
		};
		const iconSize = getIconSize();
		const iconX = x + (width - iconSize) / 2;
		const iconY = y + (height - iconSize) / 2;
		return (
			<g className="cursor-pointer">
				<rect
					x={x}
					y={y}
					width={width}
					height={height}
					fill={color}
					stroke={theme === "dark" ? colors.white : colors.blue}
					strokeWidth={2}
				/>
				<foreignObject x={iconX} y={iconY} width={iconSize} height={iconSize}>
					<Icon id={id} setColor={colors.white} size={iconSize} />
				</foreignObject>
			</g>
		);
	};

	const CustomTooltip = ({ active, payload, dataID }: any) => {
		if (!active || !payload || !payload.length) {
			return null;
		}
		const data = payload[0].payload;
		return (
			<div
				className="p-4"
				style={{
					backgroundColor: theme === "dark" ? colors.white : colors.blue,
				}}
			>
				<p
					className="bold"
					style={{
						color: theme === "dark" ? colors.dark : colors.white,
						marginBottom: fontSize,
					}}
				>
					{data.name}
				</p>
				<div className="flex justify-between">
					<p style={{ color: theme === "dark" ? colors.dark : colors.white }}>
						Gesamt:
					</p>
					<p
						className="bold ml-2"
						style={{ color: theme === "dark" ? colors.dark : colors.white }}
					>
						{formatNumber(data.value)}
						{dataID === "umsatz" ? " Mio. €" : " Tsd."}
					</p>
				</div>
				<div className="flex justify-between">
					<p style={{ color: theme === "dark" ? colors.dark : colors.white }}>
						Anteil:
					</p>
					<p
						className="bold"
						style={{ color: theme === "dark" ? colors.dark : colors.white }}
					>
						{Math.ceil((100 / data.totalValue) * data.value)}%
					</p>
				</div>
			</div>
		);
	};

	const SingleTreeMap = ({ treeMapData }: any) => {
		let totalValue = 0;
		treeMapData.data.forEach((entry: any) => (totalValue += entry.value));
		const collectData = sektoren.map((sektor) => {
			const findData = treeMapData.data.find(
				(entry: any) => entry.branche === sektor.id,
			);
			const returnData = {
				...sektor,
				value: findData.value,
				totalValue,
			};
			return returnData;
		});
		return (
			<div
				style={{
					border:
						theme === "dark"
							? `1px ${colors.white} solid`
							: `1px ${colors.blue} solid`,
					position: "relative",
				}}
			>
				<ResponsiveContainer width="100%" height={window.innerHeight * 0.7}>
					<TreeMapRecharts
						data={collectData}
						aspectRatio={1}
						dataKey="value"
						fill="none"
						content={<CustomTreemapNode />}
						isAnimationActive={false}
						isUpdateAnimationActive={false}
					>
						<Tooltip
							content={(props) => (
								<CustomTooltip {...props} dataID={treeMapData.id} />
							)}
						/>
					</TreeMapRecharts>
				</ResponsiveContainer>
			</div>
		);
	};

	return (
		<section id="treemap" className="py-14">
			{treemaps.map((treemap, index) => (
				<div key={treemap.id} className={!index ? "" : "mt-14"}>
					<h2 className="mb-4">{treemap?.title}</h2>
					<p className="mb-14">{treemap?.text}</p>
					<SingleTreeMap treeMapData={treemap} />
				</div>
			))}
		</section>
	);
};

export default TreeMap;
