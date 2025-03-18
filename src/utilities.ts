const hexToRgba = (hex: string, opacity: number) => {
	// Remove # if present
	hex = hex.replace(/^#/, "");

	// Parse RGB values
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export { hexToRgba };
