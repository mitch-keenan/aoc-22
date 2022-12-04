// https://adventofcode.com/2022/day/4

export function solve(input: string) {
	const pairs = input.split("\n");
	pairs.pop(); // drop empty line
	return pairs.reduce((total: number, pair: string) => {
		const [r1, r2] = pair.split(",");
		const [s1, e1] = r1.split("-").map((n) => parseInt(n, 10));
		const [s2, e2] = r2.split("-").map((n) => parseInt(n, 10));

		if ((s1 >= s2 && s1 <= e2) || (e1 >= s2 && e1 <= e2)) {
			return total + 1;
		}

		if ((s2 >= s1 && s2 <= e1) || (e2 >= s1 && e2 <= e1)) {
			return total + 1;
		}

		return total;
	}, 0);
}
