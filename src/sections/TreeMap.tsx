import { ResponsiveContainer, Tooltip, Treemap } from "recharts";
import sektoren from "../data/sektoren.json";
import revenueExample from "../data/revenue-example.json";
import colors from "../data/colors.json";
import Icon from "../components/Icons";
import { useGlobalContext } from "../GlobalContext";

const TreeMapSection: React.FC = () => {
	const { theme } = useGlobalContext();
	const data = sektoren.map((sektor) => {
		return {
			name: sektor.name,
			size: revenueExample[sektor.id as keyof typeof revenueExample] || 0,
			fill: sektor.color,
			id: sektor.id,
		};
	});

	const CustomTreemapNode = (props: any) => {
		const { x, y, width, height, id, fill } = props;
		const iconSize = height <= 16 ? height - 4 : 16;
		const iconX = x + (width - iconSize) / 2;
		const iconY = y + (height - iconSize) / 2;
		return (
			<g className="cursor-pointer">
				<rect
					x={x}
					y={y}
					width={width}
					height={height}
					fill={fill}
					stroke={theme === "dark" ? colors.white : colors.blue}
					strokeWidth={2}
				/>
				<foreignObject x={iconX} y={iconY} width={iconSize} height={iconSize}>
					<Icon id={id} setColor={colors.white} size={iconSize} />
				</foreignObject>
			</g>
		);
	};

	const CustomTooltip = ({ active, payload }: any) => {
		if (!active || !payload || !payload.length) return null;
		const data = payload[0].payload;
		return (
			<div
				className="p-2 shadow-md"
				style={{
					backgroundColor: theme === "dark" ? colors.white : colors.blue,
				}}
			>
				<p
					className="bold mb-2"
					style={{ color: theme === "dark" ? colors.dark : colors.white }}
				>
					{data.name}
				</p>
				<p style={{ color: theme === "dark" ? colors.dark : colors.white }}>
					Gesamt: {data.size} Mio. €
				</p>
			</div>
		);
	};

	return (
		<section id="treemap" className="mb-20">
			<h2>Was sind die größten Branchen?</h2>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc iaculis
				malesuada nulla sit amet luctus. Suspendisse eget tellus orci. Aliquam
				sit amet viverra turpis. Maecenas facilisis eros at convallis vulputate.
				Ut ut posuere dolor. Fusce nec feugiat ipsum.{" "}
			</p>
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
					<Treemap
						data={data}
						aspectRatio={1}
						dataKey="size"
						fill="none"
						content={<CustomTreemapNode />}
						isAnimationActive={false}
						isUpdateAnimationActive={false}
					>
						<Tooltip content={<CustomTooltip />} />
					</Treemap>
				</ResponsiveContainer>
			</div>
		</section>
	);
};

export default TreeMapSection;
