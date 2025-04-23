export type ChapterKeys =
	| "welcome"
	| "einleitung"
	| "who_innovates"
	| "how_innovates"
	| "environment"
	| "berlin"
	| "support"
	| "data_ai";

export type Region = "ber" | "de";

export type ChartTypes =
	| "big_fact"
	| "big_fact_comparison"
	| "bar_chart"
	| "bar_chart_delta"
	| "bar_chart_stacked"
	| "bar_chart_full"
	| "bar_chart_filter_keys"
	| "area_chart"
	| "tree_map"
	| "matrix";

export type ChartUnits = "" | "€" | "%";

type dataKeys =
	| "year"
	| "energie"
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
	| "unternehmensberatung"
	| "software"
	| "industrie"
	| "dienstleistungen"
	| "ber"
	| "de"
	| "existing_environmental_taxes_or_charges"
	| "compliance_with_existing_regulations"
	| "public_funding_for_environmental_innovations"
	| "expected_future_regulations_or_environmental_taxes"
	| "current_or_expected_demand_for_environmental_innovations"
	| "improving_company_reputation"
	| "industry_self_commitments_or_standards"
	| "rising_costs_for_energy_or_raw_materials"
	| "requirements_in_public_procurement"
	| "innovations_intensitaet"
	| "fue_intensitaet"
	| "product_innovation_share"
	| "process_innovation_share"
	| "umsatz_markt_neuheiten"
	| "umsatz_nachahmer_innovationen"
	| "umsatz_produkt_neuheiten"
	| "insgesamt";

export type StickyItemData =
	| {
			branche: string;
			value: number;
	  }[]
	| {
			[key: dataKeys]: number;
	  }
	| {
			[key: dataKeys]: number;
	  }[]
	| {
			[key: dataKeys]: {
				value: number;
				delta: number;
			};
	  }[]
	| {
			[key: Region]: {
				[key: dataKeys]: number;
			}[];
	  }
	| {
			[key: dataKeys]: {
				[key: dataKeys]: number;
			}[];
	  }
	| undefined;

export type StickyItem = {
	id: string;
	title: string;
	displayNumber?: string;
	chart_type?: ChartTypes;
	chart_unit?: ChartUnits;
	has_tooltip?: boolean;
	multiline_y_axis_label?: boolean;
	text?: string;
	facts?: { fact: string; unit: string }[];
	bar_chart_unit_breakpoint?:
		| number
		| {
				[key: Region]: number;
		  };
	sortsAfter?: dataKeys[];
	togglesBetween?: dataKeys[];
	data?: StickyItemData;
};
export type BranchenItem = {
	id: string;
	name: string;
	color: string;
	sektor: string;
	sektor_id: string;
};
