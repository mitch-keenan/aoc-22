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
	return sacks.reduce((total, sack) => {
		const items = sack.split("");
		const midpoint = items.length / 2;
		const firstHalfSet = new Set(items.slice(0, midpoint));
		let dupeItem = null;
		for (let i = midpoint; i < items.length; i++) {
			if (firstHalfSet.has(items[i])) {
				dupeItem = items[i];
				break;
			}
		}
		if (!dupeItem) throw new Error(`No dupe found in sack ${sack}`);
		return total + getCharScore(dupeItem);
	}, 0);
}
