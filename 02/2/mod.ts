// https://adventofcode.com/2022/day/2#part2

enum PLAYS {
	ROCK = 1,
	PAPER = 2,
	SCISSORS = 3,
}

enum SCORES {
	WIN = 6,
	TIE = 3,
	LOSE = 0,
}

const decodingMap: { [key: string]: PLAYS } = {
	A: PLAYS.ROCK,
	B: PLAYS.PAPER,
	C: PLAYS.SCISSORS,
};

const outcomeMap: { [key: string]: SCORES } = {
	X: SCORES.LOSE,
	Y: SCORES.TIE,
	Z: SCORES.WIN,
};

// Maps a move to a map of scores to the plays you need to make to get them:
// i.e. movesMap[PLAYS.ROCK][SCORES.WIN] will return the play you need to make against ROCK in order to WIN: PAPER
const movesMap = {
	[PLAYS.ROCK]: {
		[SCORES.WIN]: PLAYS.PAPER,
		[SCORES.TIE]: PLAYS.ROCK,
		[SCORES.LOSE]: PLAYS.SCISSORS,
	},
	[PLAYS.SCISSORS]: {
		[SCORES.WIN]: PLAYS.ROCK,
		[SCORES.TIE]: PLAYS.SCISSORS,
		[SCORES.LOSE]: PLAYS.PAPER,
	},
	[PLAYS.PAPER]: {
		[SCORES.WIN]: PLAYS.SCISSORS,
		[SCORES.TIE]: PLAYS.PAPER,
		[SCORES.LOSE]: PLAYS.ROCK,
	},
};

export function solve(input: string) {
	const games = input.split("\n");
	games.pop(); // drop empty line
	return games.reduce((total, game) => {
		const [youCoded, outcomeCoded] = game.split(" ");
		const you = decodingMap[youCoded];
		const outcome = outcomeMap[outcomeCoded];
		const move = movesMap[you][outcome];
		return total + move + outcome;
	}, 0);
}
