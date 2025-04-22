const hexToRgba = (hex: string, opacity: number) => {
	// Remove # if present
	const getHex = hex.replace(/^#/, "");

	// Parse RGB values
	const r = parseInt(getHex.substring(0, 2), 16);
	const g = parseInt(getHex.substring(2, 4), 16);
	const b = parseInt(getHex.substring(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const formatNumber = (num: number): number => {
	if (num < 1000) {
		return num;
	}

	const billions = num / 1000;
	return Math.round(billions * 10) / 10; // one decimal
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
		let formatted = billions.toFixed(1);
		if (formatted.endsWith(",0")) {
			formatted = formatted.slice(0, -2);
		}
		return `${formatted} Mrd. €`;
	}
	return `${value.toString()} Mio. €`;
}

export {
	hexToRgba,
	formatNumber,
	isInRange,
	roundToTwoDecimals,
	formatEuroNumber,
};
