const hexToRgba = (hex: string, opacity: number) => {
	// Remove # if present
	const getHex = hex.replace(/^#/, "");

	// Parse RGB values
	const r = parseInt(getHex.substring(0, 2), 16);
	const g = parseInt(getHex.substring(2, 4), 16);
	const b = parseInt(getHex.substring(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const formatNumber = (num: number) => {
	return new Intl.NumberFormat("de-DE").format(num);
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
	if (value >= 1000) {
		const billions = value / 1000;
		let formatted = billions.toFixed(1).replace(".", ","); // 3.2 → "3,2"
		if (formatted.endsWith(",0")) {
			formatted = formatted.slice(0, -2); // Remove trailing ",0"
		}
		return `${formatted} Mrd. €`;
	}
	return `${value.toString().replace(".", ",")} Mio. €`;
}

function formatThousand(value: number): string {
	if (value < 10000) {
		return `${value.toLocaleString("de-DE")} Tsd.`;
	}
	const millions = value / 1000000;
	const rounded = Math.round(millions * 10) / 10; // e.g., 2.3
	const formatted = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
	return `${formatted.replace(".", ",")} Mio.`;
}

export {
	hexToRgba,
	formatNumber,
	isInRange,
	roundToTwoDecimals,
	formatEuroNumber,
	formatThousand,
};
