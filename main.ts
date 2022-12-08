import { parse } from "https://deno.land/std@0.119.0/flags/mod.ts";

interface Args {
	day: number;
	puzzle: number;
	test: boolean;
}

function getArgs(): Args {
	const flags = parse(Deno.args, {
		string: ["puzzle", "day", "test"],
		alias: { puzzle: "p", day: "d", test: "t" },
	});

	const dayArg = flags.day;
	if (!dayArg) {
		console.error("Day number required, use `-d #` or `-day #`");
		Deno.exit(1);
	}
	const day = parseInt(dayArg, 10);

	const puzzleArg = flags.puzzle;
	if (!puzzleArg) {
		console.error("Puzzle number required, use `-p #` or `-puzzle #`");
		Deno.exit(1);
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
const { solve } = await import(import.meta.resolve(`./${folderName}/mod.ts`));
if (typeof solve === "function") {
	const result = await solve(input);
	console.log(
		`Solution to Day ${args.day} - Puzzle ${args.puzzle}${
			args.test ? " - TEST" : ""
		}: ` + result
	);
}
