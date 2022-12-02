// https://adventofcode.com/2022/day/2

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
	X: PLAYS.ROCK,
	Y: PLAYS.PAPER,
	Z: PLAYS.SCISSORS,
};

// Map of moves to the move they beat
const winMap = {
	[PLAYS.ROCK]: PLAYS.SCISSORS,
	[PLAYS.SCISSORS]: PLAYS.PAPER,
	[PLAYS.PAPER]: PLAYS.ROCK,
};

function findOutcome(you: PLAYS, me: PLAYS): SCORES {
	if (you === me) return SCORES.TIE;
	if (winMap[me] === you) return SCORES.WIN;
	return SCORES.LOSE;
}

export function solve(input: string) {
	const games = input.split("\n");
	games.pop(); // drop empty line
	return games.reduce((total, game) => {
		const [youCoded, meCoded] = game.split(" ");
		const you = decodingMap[youCoded];
		const me = decodingMap[meCoded];
		const outcome = findOutcome(you, me);
		return total + me + outcome;
	}, 0);
}
