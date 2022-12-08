// https://adventofcode.com/2022/day/4

interface Instruction {
	count: number;
	fromIndex: number;
	toIndex: number;
}

/* Key: stack index, value: stack */
type Stacks = Map<number, string[]>;

const parseStacks = (stacksInput: string): Stacks => {
	const s = new Map<number, Array<string>>();
	const lines = stacksInput.split("\n");
	lines.pop(); // remove labels
	lines.forEach((line) => {
		let stackIndex = -1;
		for (let i = 0; i < line.length; i += 3) {
			if ((i + 1) % 4 === 0) {
				// skip gutters (3, 7, 11, etc)
				i -= 2;
				continue;
			}
			stackIndex += 1;
			const chunk = line.slice(i, i + 3);
			if (chunk === "   ") continue;
			const value = chunk.replaceAll(/[\]\[]/gi, "");
			const stack = s.get(stackIndex) || new Array<string>();
			stack.unshift(value);
			s.set(stackIndex, stack);
		}
	});
	return s;
};

const moveCrates = (instruction: Instruction, stacks: Stacks) => {
	const { count, fromIndex, toIndex } = instruction;
	const from = stacks.get(fromIndex);
	const to = stacks.get(toIndex);
	if (!from || !to) {
		throw new Error(
			`One of stacks ${fromIndex} or ${toIndex} does not have an entry`
		);
	}
	for (let i = 0; i < count; i++) {
		const item = from.pop();
		if (!item) {
			throw new Error(
				"Could not execute move of ${count} crates from ${fromIndex} to ${toIndex} as stack ${fromIndex} did not have enough crates"
			);
		}
		to.push(item);
	}
};

const parseInstructions = (instructionsInput: string): Instruction[] => {
	const result: Instruction[] = [];
	const instructions = instructionsInput.split("\n");
	instructions.pop(); // remove empty line
	instructions.forEach((instruction) => {
		const match = instruction.match(/move ([0-9]+) from ([0-9]+) to ([0-9]+)/);
		if (!match) throw new Error(`Error parsing instruction "${instruction}"`);
		// const [_, count, fromIndex, toIndex] = match;
		const count = parseInt(match[1], 10);
		const fromIndex = parseInt(match[2], 10) - 1;
		const toIndex = parseInt(match[3], 10) - 1;
		result.push({ count, fromIndex, toIndex });
	});
	return result;
};

/** Non-essential method for re-printing the stacks in the format from the puzzle */
const _printStacks = (stackMap: Stacks) => {
	const heightMap = new Map<number, Map<number, string>>(); // height => stackNumber => value
	const stacksItr = stackMap.entries();
	let maxHeight = 0;
	let stackCount = 0;
	const labels: string[] = [];
	for (const stack of stacksItr) {
		stackCount++;
		labels.push(` ${stackCount} `);
		const [stackNum, stackItems] = stack;
		if (stackItems.length > maxHeight) maxHeight = stackItems.length;
		for (let height = 0; height < stackItems.length; height++) {
			const tier = heightMap.get(height) || new Map<number, string>();
			tier.set(stackNum, stackItems[height]);
			heightMap.set(height, tier);
		}
	}
	for (let i = maxHeight - 1; i >= 0; i--) {
		const tier = heightMap.get(i);
		if (!tier) throw new Error(`No tier for height ${i} in printStacks`);
		const line: string[] = [];
		for (let stackIdx = 0; stackIdx < stackCount; stackIdx++) {
			const value = tier.get(stackIdx);
			if (value) {
				line.push(`[${value}]`);
			} else {
				line.push("   ");
			}
		}
		console.log(line.join(" "));
	}
	// print stack labels
	console.log(labels.join(" "));
};

export function solve(input: string) {
	const [stacksInput, instructionsInput] = input.split("\n\n");
	const stackMap = parseStacks(stacksInput);
	const instructions = parseInstructions(instructionsInput);
	instructions.forEach((instruction) => moveCrates(instruction, stackMap));

	// To print out stacks after movements in original format
	// _printStacks(stackMap);

	let result = "";
	for (let i = 0; i < stackMap.size; i++) {
		const stack = stackMap.get(i);
		if (!stack) throw new Error(`No stack for index ${i}`);
		result += stack[stack.length - 1];
	}
	return result;
}
