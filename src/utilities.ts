import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const isInRange = (num: number) => {
	const from = -50;
	const to = 50;
	return num >= from && num <= to;
};

function roundToTwoDecimals(num: number): number {
	return Math.round(num * 100) / 100;
}

function formatEuroNumber(value: number): string {
	const getNumber = new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value);
	return `${getNumber.toString().replace("€", "")}Mio. €`;
}

function formatNumber(value: number): string {
	return new Intl.NumberFormat("de-DE").format(value);
}

function sumNumericValues(obj: any) {
	let total = 0;

	for (const key in obj) {
		if (typeof obj[key] === "number") {
			total += obj[key];
		}
	}

	return total;
}

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export {
	isInRange,
	roundToTwoDecimals,
	formatEuroNumber,
	formatNumber,
	sumNumericValues,
	cn,
};
