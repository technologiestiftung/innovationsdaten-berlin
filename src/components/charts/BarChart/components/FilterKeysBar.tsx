import React from "react";
import { Bar, LabelList } from "recharts";
import { useGlobalContext } from "@/GlobalContext";
import ValueLabel from "./ValueLabel";
import colors from "@/data/colors.json";
import MobileFilterKeysValueLabel from "./MobileFilterKeysValueLabel";
import FilledBar from "./FilledBar";

type FilterKeysBarProps = {
	chart_type: string;
	activeFilter?: string | null;
	has_tooltip?: boolean;
	collectData?: any[];
	chart_unit?: string;
	id?: string;
	data?: any[];
};

const FilterKeysBar: React.FC<FilterKeysBarProps> = ({
	chart_type,
	activeFilter,
	has_tooltip,
	collectData,
	chart_unit,
	id,
	data,
}: FilterKeysBarProps) => {
	const { animationDuration, isMobile } = useGlobalContext();
	if (
		!chart_type.includes("filter_keys") ||
		!activeFilter ||
		!collectData ||
		!id ||
		!data
	) {
		return null;
	}
	return (
		<>
			{chart_type.includes("branchen") ? (
				<Bar
					dataKey={activeFilter}
					stackId="1"
					cursor={has_tooltip ? "pointer" : "default"}
					animationDuration={animationDuration}
					shape={<FilledBar />}
				>
					<LabelList
						content={
							<ValueLabel
								collectData={collectData}
								chart_type={chart_type}
								chart_unit={chart_unit}
								id={id}
							/>
						}
					/>
				</Bar>
			) : (
				<Bar
					dataKey={activeFilter}
					stackId="1"
					fill={colors.blue}
					cursor={has_tooltip ? "pointer" : "default"}
					animationDuration={animationDuration}
				>
					{isMobile && (
						<LabelList
							dataKey="name"
							content={<MobileFilterKeysValueLabel />}
						/>
					)}
					<LabelList
						content={
							<ValueLabel
								collectData={collectData}
								chart_type={chart_type}
								chart_unit={chart_unit}
								id={id}
							/>
						}
					/>
				</Bar>
			)}
		</>
	);
};

export default FilterKeysBar;
