// https://adventofcode.com/2022/day/5

export function solve(input: string) {
	const [line] = input.split("\n"); // only use first line

	let i = 0;
	while (i <= line.length - 4) {
		const [a, b, c, d] = line.slice(i, i + 4);
		if (a == b || a == c || a == d) {
			i += 1;
			continue;
		}
		if (b == c || b == d) {
			i += 2;
			continue;
		}
		if (c == d) {
			i += 3;
			continue;
		}
		return i + 4;
	}
}
