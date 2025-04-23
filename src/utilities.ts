const hexToRgba = (hex: string, opacity: number) => {
	// Remove # if present
	const getHex = hex.replace(/^#/, "");

	// Parse RGB values
	const r = parseInt(getHex.substring(0, 2), 16);
	const g = parseInt(getHex.substring(2, 4), 16);
	const b = parseInt(getHex.substring(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

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
	return `${getNumber.toString()} Mio. €`;
}

function formatNumber(value: number): string {
	return new Intl.NumberFormat("de-DE").format(value);
}

export {
	hexToRgba,
	isInRange,
	roundToTwoDecimals,
	formatEuroNumber,
	formatNumber,
};
