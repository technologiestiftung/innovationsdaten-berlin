export type ChapterKeys =
	| "chapters"
	| "welcome"
	| "overview"
	| "big-fact-berlin"
	| "who_innovates"
	| "berliner_unternehmen"
	| "branchen";

export interface ChapterProps {
	title: string;
	text?: string;
	fact?: string;
	unit?: string;
}

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
	| undefined;

export type StickyItem = {
	id: string;
	title: string;
	text: string;
	unit?: string;
	data?: StickyItemData;
};
