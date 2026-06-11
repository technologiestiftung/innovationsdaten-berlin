import { MatrixData } from "@/types/global";

const sanitize = (str: string) =>
	str
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/[^a-z0-9_]/g, "");

function replaceAllCustom(input: string) {
	if (!input) {
		return input;
	}
	return input
		.replace(/<br\s*\/?>/gi, " ") // replace all <br>, <br/>, <br /> with space
		.replace(/&shy;/gi, ""); // remove all &shy;
}

function getMinMax(data: MatrixData[]): { min: number; max: number } {
	if (data.length === 0) {
		throw new Error("Data array is empty");
	}

	let min = data[0].value;
	let max = data[0].value;

	for (const { value } of data) {
		if (value < min) {
			min = value;
		}
		if (value > max) {
			max = value;
		}
	}

	return { min, max };
}

export { sanitize, replaceAllCustom, getMinMax };
