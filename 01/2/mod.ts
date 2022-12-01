// https://adventofcode.com/2022/day/1#part2

import { sumOf } from "https://deno.land/std@0.125.0/collections/sum_of.ts";

const insertIfNeeded = (value: number, highScores: number[]) => {
	let i = highScores.length - 1;
	if (value <= highScores[i]) return;

	while (i >= 0 && value > highScores[i]) i--;
	highScores.splice(i + 1, 0, value);
	highScores.pop();
};

// Sum of calories for top 3 elves with most
export function solve(input: string) {
	const elves = input.split("\n\n");
	const largest = [0, 0, 0];

	elves.forEach((elfInput) => {
		const total = sumOf(
			elfInput.split("\n").filter((str) => str !== ""),
			(str) => parseInt(str, 10)
		);
		insertIfNeeded(total, largest);
	});

	return sumOf(largest, (n) => n);
}
