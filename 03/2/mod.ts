// https://adventofcode.com/2022/day/3

type Range = {
	START: number;
	END: number;
};

/**
 * Inclusive range of unicode codes for alphabetic characters in lower and uppercase
 */
const UNICODE_RANGE = {
	UPPERCASE: {
		START: 65,
		END: 90,
	},
	LOWERCASE: {
		START: 97,
		END: 122,
	},
};

const isInRange = (num: number, range: Range): boolean => {
	return num >= range.START && num <= range.END;
};

const getCharScore = (letter: string) => {
	const unicodeNum = letter.charCodeAt(0);
	if (isInRange(unicodeNum, UNICODE_RANGE.UPPERCASE)) {
		// upper case
		return unicodeNum - (UNICODE_RANGE.UPPERCASE.START - 27);
	}

	if (isInRange(unicodeNum, UNICODE_RANGE.LOWERCASE)) {
		// lower case
		return unicodeNum - UNICODE_RANGE.LOWERCASE.START + 1;
	}

	throw new Error(`Invalid character: ${letter}`);
};

export function solve(input: string) {
	const sacks = input.split("\n");
	sacks.pop(); // drop empty line
	let total = 0;

	for (let i = 0; i < sacks.length; i += 3) {
		const [one, two, three] = sacks.slice(i, i + 3);
		const setOne = new Set(one); // All of line one
		const setTwo = new Set(); // Overlap of 1/2
		let letter = null; // Overlap of 1/2/3, should be single char
		two.split("").forEach((l) => {
			if (setOne.has(l)) setTwo.add(l);
		});
		three.split("").forEach((l) => {
			if (setTwo.has(l)) letter = l;
		});
		if (!letter) throw new Error(`No matching letter in set ${i / 3 + 1}`);
		total += getCharScore(letter);
	}
	return total;
}
