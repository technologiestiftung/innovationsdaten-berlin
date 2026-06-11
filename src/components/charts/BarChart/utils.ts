import colors from "@/data/colors.json";

const getBarCategoryGap = (isMobile: boolean, chart_type: string) => {
	if (
		isMobile &&
		chart_type.includes("filter_keys") &&
		!chart_type.includes("branchen")
	) {
		return "25%";
	}
	return "10%";
};
const wrapTextForCustomLineHeightYAxisTick = (
	text: string,
	maxCharsPerLine = 30,
) => {
	const words = text.split(" ");
	const lines = [];
	let currentLine = "";

	words.forEach((word) => {
		if ((currentLine + word).length > maxCharsPerLine) {
			lines.push(currentLine.trim());
			currentLine = word + " ";
		} else {
			currentLine += word + " ";
		}
	});

	lines.push(currentLine.trim());
	return lines;
};
const getColorBar = (index: number) => {
	if (!index) {
		return colors.blue;
	}
	if (index === 1) {
		return colors.cyan_light;
	}
	if (index === 2) {
		return colors.green_light;
	}
	if (index === 3) {
		return colors.bar_chart_3;
	}
	if (index === 4) {
		return colors.bar_chart_4;
	}
	return colors.blue;
};
const wrapText = (text: string): string[] => {
	const words = text.split(" ");
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	const fontSizeMobileValue = 14;
	const fontFamily = "Clan Pro";
	const maxWidth = window.innerWidth - 48;
	if (!context) {
		return [text];
	}

	context.font = `${fontSizeMobileValue}px "${fontFamily}", sans-serif`;
	const lines: string[] = [];
	let currentLine = "";

	for (const word of words) {
		const testLine = currentLine ? currentLine + " " + word : word;
		const { width } = context.measureText(testLine);
		if (width > maxWidth && currentLine !== "") {
			lines.push(currentLine);
			currentLine = word;
		} else {
			currentLine = testLine;
		}
	}
	if (currentLine) {
		lines.push(currentLine);
	}
	return lines;
};
const getTransformY = (name: string) => {
	const lines = wrapText(name);
	return lines.length - 1;
};

export {
	getBarCategoryGap,
	wrapTextForCustomLineHeightYAxisTick,
	getColorBar,
	wrapText,
	getTransformY,
};
