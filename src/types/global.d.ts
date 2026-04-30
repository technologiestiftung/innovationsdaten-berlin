export type ChapterKeys =
	| "welcome"
	| "einleitung"
	| "who_innovates"
	| "how_innovates"
	| "environment"
	| "berlin"
	| "support"
	| "data_ai";

export type Chapter = {
	link: ChapterKeys;
	title: string;
};

export type DataObj = Record<ChapterKeys, ChapterItem[]>;

export type RegionKey = {
	[key: Region]: number;
};

export type ChapterItem = {
	id: string;
	title: string;
	text: string;
	chart_type: ChartTypes;
	bigTitleCard?: boolean;
	chart_unit?: ChartUnits;
	has_tooltip?: boolean;
	hide_toggle?: boolean;
	max_value?: number | RegionKey;
	bigFacts?: BigFactType[];
	sortsAfter?: DataKeys[];
	sortsAfterOnStart?: DataKeys;
	togglesBetween?: DataKeys[];
	chartData?: ChartData;
};

export type BigFactType = { fact: string; unit: string };

export type TreemapDataType = {
	branche: Branchen;
	value: number;
}[];

export type AreaChartSektorenDataType = {
	[key: Region]: {
		year: number;
		[key: Sektoren]: number;
	}[];
};

export type AreaChartBranchenDataType = {
	[key: Region]: {
		year: number;
		[key: Branchen]: number;
	}[];
};

export type AreaChartToggleDataType = {
	[key: DataKeys]: {
		year: number;
		[key: Region]: number;
	}[];
};

export type BarChartDeltaDataType = {
	[key: Region]: {
		[key: Branchen]: {
			value: number;
			delta: number;
		};
	};
};

export type BarChartDataType = {
	[key: Region]: {
		[key: Branchen]: number;
	};
};

export type BarChartStackedDataType = {
	[key: Region]: {
		id: Branchen;
		[key: DataKeys]: number;
	}[];
};

export type BarChartItem = {
	id: string;
	name: string;
	value: number;
	delta?: number;
	positiveDelta?: boolean;
	isSmall?: boolean;
	color?: string;
};

export type MatrixChartDataType = {
	[key: Region]: MatrixData[];
};

export type AreaChartDataType =
	| AreaChartSektorenDataType
	| AreaChartBranchenDataType
	| AreaChartToggleDataType;

export type ChartData =
	| TreemapDataType
	| AreaChartDataType
	| BarChartDeltaDataType
	| BarChartDataType
	| BarChartStackedDataType
	| MatrixChartDataType;

export type Region = "ber" | "de";

export type Branchen =
	| "energie"
	| "software"
	| "fahrzeugbau"
	| "nahrung"
	| "holz"
	| "pharma"
	| "sonstige_konsumgueter"
	| "elektroindustrie"
	| "metall"
	| "telekommunikation"
	| "finanz"
	| "kreativ"
	| "forschung"
	| "architektur"
	| "unternehmensberatung";

export type Sektoren = "industrie" | "dienstleistungen";

export type ChartTypes =
	| "big_fact"
	| "tree_map"
	| "branchen_list"
	| "bar_chart"
	| "bar_chart_delta"
	| "bar_chart_stacked"
	| "bar_chart_filter_keys"
	| "bar_chart_filter_keys_branchen"
	| "area_chart"
	| "area_chart_sektoren"
	| "area_chart_branchen"
	| "area_chart_toggle"
	| "matrix";

export type ChartUnits = "" | "€" | "%";

export type DifferenzKeys =
	| "innovations_intensitaet"
	| "fue_intensitaet"
	| "differenz_intensitaet";

export type InnovationShareKeys =
	| "product_innovation_share"
	| "process_innovation_share";

export type DataKeys =
	| "year"
	| "existing_environmental_taxes_or_charges"
	| "compliance_with_existing_regulations"
	| "public_funding_for_environmental_innovations"
	| "expected_future_regulations_or_environmental_taxes"
	| "current_or_expected_demand_for_environmental_innovations"
	| "improving_company_reputation"
	| "industry_self_commitments_or_standards"
	| "rising_costs_for_energy_or_raw_materials"
	| "requirements_in_public_procurement"
	| "innovator_rate"
	| "umsatz_markt_neuheiten"
	| "umsatz_nachahmer_innovationen"
	| "umsatz_produkt_neuheiten"
	| "insgesamt"
	| InnovationShareKeys
	| DifferenzKeys
	| Sektoren
	| Branchen
	| Region;

export type BranchenItem = {
	id: string;
	name: string;
	color: string;
	sektor: string;
	sektor_id: string;
};

export type MatrixData = {
	x: string;
	y: string;
	value: number;
};
