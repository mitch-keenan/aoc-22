// https://adventofcode.com/2022/day/1

import { sumOf } from "https://deno.land/std@0.125.0/collections/sum_of.ts";

// Sum of calories for elf with most
export function solve(input: string) {
	const elves = input.split("\n\n");
	let largest = 0;
	elves.forEach((elfInput) => {
		const total = sumOf(
			elfInput.split("\n").filter((str) => str !== ""),
			(str) => parseInt(str, 10)
		);
		largest = Math.max(total, largest);
	});
	return largest;
}
