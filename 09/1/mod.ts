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
	tail: Pos;
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
	const { tail, head } = rope;
	const xDiff = head.x - tail.x; // > 0 means head is to right of tail
	const yDiff = head.y - tail.y; // > 0 means head is above tail
	const xAbsDiff = Math.abs(xDiff);
	const yAbsDiff = Math.abs(yDiff);

	if (xAbsDiff === 0) {
		// same column
		if (yAbsDiff <= 1) return;
		tail.y += yDiff > 0 ? 1 : -1;
		rope.visited.add(`${tail.x},${tail.y}`);
		return;
	}

	if (yAbsDiff === 0) {
		// same column
		if (xAbsDiff <= 1) return;
		tail.x += xDiff > 0 ? 1 : -1;
		rope.visited.add(`${tail.x},${tail.y}`);
		return;
	}

	if (yAbsDiff === 1 && xAbsDiff === 1) return;

	tail.y += yDiff > 0 ? 1 : -1;
	tail.x += xDiff > 0 ? 1 : -1;
	rope.visited.add(`${tail.x},${tail.y}`);
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
	log(`Moved head 1 in ${dir}:`, dir);
	printGrid(rope);
	updateTail(rope);
	log("Tail update:");
	printGrid(rope);
	log("\n");
};

const doStep = (step: Step, rope: Rope): void => {
	for (let i = 0; i < step.distance; i++) {
		doSingleMove(step.dir, rope);
	}
};

const printGrid = (rope: Rope): void => {
	if (!LOGGING) return;

	let maxX = 0;
	let maxY = 0;
	rope.visited.forEach((e) => {
		const [xString, yString] = e.split(",");
		const x = parseInt(xString, 10);
		const y = parseInt(yString, 10);
		if (x > maxX) maxX = x;
		if (y > maxY) maxY = y;
	});

	maxX = Math.max(maxX, rope.head.x, rope.tail.x);
	maxY = Math.max(maxY, rope.head.y, rope.tail.y);

	let result = "";
	for (let y = maxY; y >= 0; y--) {
		for (let x = 0; x <= maxX; x++) {
			if (x == rope.head.x && y == rope.head.y) {
				result += "H";
				continue;
			}
			if (x == rope.tail.x && y == rope.tail.y) {
				result += "T";
				continue;
			}
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

	const rope: Rope = {
		visited: new Set(["0,0"]),
		head: { x: 0, y: 0 },
		tail: { x: 0, y: 0 },
	};

	steps.forEach((step) => doStep(step, rope));

	printGrid(rope);

	return rope.visited.size;
};
