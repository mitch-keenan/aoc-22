import { parse } from "https://deno.land/std@0.119.0/flags/mod.ts";

interface Args {
	day: number;
	puzzle: number;
	test: boolean;
}

const abort = (...args: unknown[]) => {
	console.error(...args);
	Deno.exit(1);
};

function getArgs(): Args {
	const flags = parse(Deno.args, {
		string: ["puzzle", "day", "test"],
		alias: { puzzle: "p", day: "d", test: "t" },
	});

	const dayArg = flags.day;
	if (!dayArg) {
		abort("Day number required, use `-d #` or `-day #`");
	}
	const day = parseInt(dayArg, 10);

	const puzzleArg = flags.puzzle;
	if (!puzzleArg) {
		abort("Puzzle number required, use `-p #` or `-puzzle #`");
	}
	const puzzle = parseInt(puzzleArg, 10);

	return { day, puzzle, test: flags.test !== undefined };
}

function getFolder({ day, puzzle }: Args) {
	let result = `${day}/${puzzle}/`;
	if (day < 10) {
		result = `0${result}`;
	}
	return result;
}

const args = getArgs();
const folderName = getFolder(args);

const input = await Deno.readTextFile(
	`./${folderName}/input${args.test ? ".test" : ""}.txt`
);
const modFilePath = import.meta.resolve(`./${folderName}/mod.ts`);
const { solve } = await import(modFilePath);
if (typeof solve !== "function") {
	abort(`"solve" imported from ${modFilePath} is not a function`);
}

if (!args.test) {
	const result = await solve(input);
	console.log(`Solution to Day ${args.day} - Puzzle ${args.puzzle}: ` + result);
	Deno.exit(0);
}

// Test mode, split on `---`
const inputs = input.split("\n---\n");
let testNum = 1;
for (const testInput of inputs) {
	const result = await solve(testInput);
	console.log(
		`D${args.day} P${args.puzzle} Test ${testNum}: ` + result + "\n\n"
	);
	testNum++;
}
