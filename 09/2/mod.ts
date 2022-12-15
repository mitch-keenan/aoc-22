enum DIR {
	UP = "U",
	DOWN = "D",
	LEFT = "L",
	RIGHT = "R",
}

interface Step {
	dir: DIR;
	distance: number;
}

interface Pos {
	x: number;
	y: number;
}

interface Rope {
	// grid: Cell[][];
	visited: Set<string>; // "x,y" as key
	head: Pos;
	tails: Pos[];
}

const LOGGING = false;
const log = (...args: unknown[]) => {
	if (LOGGING) console.log(...args);
};

const parseSteps = (input: string): Step[] => {
	const lines = input.split("\n");
	lines.pop(); // drop empty line
	return lines.map((l) => {
		const [dir, distanceStr] = l.split(" ");
		const distance = parseInt(distanceStr, 10);
		return { dir, distance } as Step;
	});
};

const updateTail = (rope: Rope): void => {
	const { tails, head } = rope;
	let lastTail = head;
	for (let i = 0; i < tails.length; i++) {
		updateTailPiece(lastTail, tails[i]);
		lastTail = tails[i];
	}
	const end = tails[tails.length - 1];
	rope.visited.add(`${end.x},${end.y}`);
};

const updateTailPiece = (head: Pos, tail: Pos): void => {
	const xDiff = head.x - tail.x; // > 0 means head is to right of tail
	const yDiff = head.y - tail.y; // > 0 means head is above tail
	const xAbsDiff = Math.abs(xDiff);
	const yAbsDiff = Math.abs(yDiff);

	if (xAbsDiff === 0) {
		// same column
		if (yAbsDiff <= 1) return;
		tail.y += yDiff > 0 ? 1 : -1;
		return;
	}

	if (yAbsDiff === 0) {
		// same column
		if (xAbsDiff <= 1) return;
		tail.x += xDiff > 0 ? 1 : -1;
		return;
	}

	if (yAbsDiff === 1 && xAbsDiff === 1) return;

	tail.y += yDiff > 0 ? 1 : -1;
	tail.x += xDiff > 0 ? 1 : -1;
};

const doSingleMove = (dir: DIR, rope: Rope): void => {
	switch (dir) {
		case DIR.UP:
			rope.head.y++;
			break;
		case DIR.DOWN:
			rope.head.y--;
			break;
		case DIR.LEFT:
			rope.head.x--;
			break;
		case DIR.RIGHT:
			rope.head.x++;
			break;
	}
	updateTail(rope);
};

const doStep = (step: Step, rope: Rope): void => {
	for (let i = 0; i < step.distance; i++) {
		doSingleMove(step.dir, rope);
	}

	log("Did Move", step);
	printGrid(rope);
};

const printGrid = (rope: Rope): void => {
	if (!LOGGING) return;

	let minX = 0;
	let minY = 0;
	let maxX = 0;
	let maxY = 0;
	rope.visited.forEach((e) => {
		const [xString, yString] = e.split(",");
		const x = parseInt(xString, 10);
		const y = parseInt(yString, 10);
		maxX = Math.max(maxX, x);
		minX = Math.min(minX, x);
		maxY = Math.max(maxY, y);
		minY = Math.min(minY, y);
	});

	maxX = Math.max(...[maxX, rope.head.x, ...rope.tails.map((t) => t.x)]);
	minX = Math.min(...[minX, rope.head.x, ...rope.tails.map((t) => t.x)]);
	maxY = Math.max(...[maxY, rope.head.y, ...rope.tails.map((t) => t.y)]);
	minY = Math.min(...[minY, rope.head.y, ...rope.tails.map((t) => t.y)]);

	let result = "";
	for (let y = maxY; y >= minY; y--) {
		for (let x = minX; x <= maxX; x++) {
			if (x == rope.head.x && y == rope.head.y) {
				result += "H";
				continue;
			}
			let wasTail = false;
			for (let i = 0; i < rope.tails.length; i++) {
				if (x == rope.tails[i].x && y == rope.tails[i].y) {
					result += i + 1;
					wasTail = true;
					break;
				}
			}
			if (wasTail) continue;
			if (x == 0 && y == 0) {
				result += "s";
				continue;
			}
			result += rope.visited.has(`${x},${y}`) ? "#" : ".";
		}
		result += "\n";
	}

	log(result);
};

export const solve = (input: string): number => {
	const steps = parseSteps(input);
	log(steps);

	const NUM_TAILS = 9;
	const tails: Pos[] = [];
	for (let i = 0; i < NUM_TAILS; i++) {
		tails.push({ x: 0, y: 0 });
	}

	const rope: Rope = {
		visited: new Set(["0,0"]),
		head: { x: 0, y: 0 },
		tails,
	};

	steps.forEach((step) => doStep(step, rope));

	printGrid(rope);

	return rope.visited.size;
};
