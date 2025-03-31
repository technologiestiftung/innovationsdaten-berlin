export type ChapterKeys =
	| "welcome"
	| "einleitung"
	| "who_innovates"
	| "testing";

export type Region = "ber" | "de";

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
	| "dienstleistungen";

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
	| undefined;

export type StickyItem = {
	id: string;
	title: string;
	text?: string;
	fact?: string;
	unit?: string;
	bar_chart_type?: "normal" | "delta";
	bar_chart_unit?: string;
	bar_chart_unit_breakpoint?: number;
	data?: StickyItemData;
};
export type BranchenItem = {
	id: string;
	name: string;
	color: string;
	sektor: string;
	sektor_id: string;
};
