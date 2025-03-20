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

export { hexToRgba, formatNumber };
