export type ChapterKeys = "einleitung" | "who_innovates";

export type StickyItemData =
	| {
			branche: string;
			value: number;
	  }[]
	| {
			year: number;
			dienstleistungen: number;
			industrie: number;
	  }[]
	| {
			year: number;
			energie: number;
			fahrzeugbau: number;
			nahrung: number;
			holz: number;
			pharma: number;
			sonstige_konsumgueter: number;
			elektroindustrie: number;
			metall: number;
			telekommunikation: number;
			finanz: number;
			kreativ: number;
			forschung: number;
			architektur: number;
			unternehmensberatung: number;
			software: number;
	  }[]
	| {
			nahrung: number;
			pharma: number;
			holz: number;
			metall: number;
			elektroindustrie: number;
			fahrzeugbau: number;
			sonstige_konsumgueter: number;
			energie: number;
			telekommunikation: number;
			software: number;
			finanz: number;
			unternehmensberatung: number;
			architektur: number;
			forschung: number;
			kreativ: number;
	  }
	| {
			[key: string]: {
				value: number;
				delta: string;
				segments: {
					percentage: number;
					color: string;
				}[];
			};
	  }
	| undefined;

export type StickyItem = {
	id: string;
	title: string;
	text?: string;
	fact?: string;
	unit?: string;
	data?: StickyItemData;
};
