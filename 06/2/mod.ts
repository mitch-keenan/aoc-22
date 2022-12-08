// https://adventofcode.com/2022/day/5

const MARKER_LENGTH = 14;

const isMarker = (str: string): boolean => {
	if (str.length !== MARKER_LENGTH) {
		throw new Error(`String of length != ${MARKER_LENGTH} passed to isMarker`);
	}

	for (let i = 0; i < MARKER_LENGTH; i++) {
		for (let j = i + 1; j < MARKER_LENGTH; j++) {
			if (str[i] == str[j]) {
				return false;
			}
		}
	}
	return true;
};

export function solve(input: string) {
	const [line] = input.split("\n"); // only use first line

	for (let i = 0; i <= line.length - MARKER_LENGTH; i++) {
		const window = line.slice(i, i + MARKER_LENGTH);
		if (isMarker(window)) {
			return i + MARKER_LENGTH;
		}
	}

	throw new Error(`No marker found`);
}
