type Tree = {
	height: number;
	x: number;
	y: number;
};

/**
 * A array of arrays representing a grid. Y is first, X second, counting up from zero
 *
 * For example, given the input
 * 123
 * 456
 * 789
 * The 9 would be at position Forest[2][2], whereas the 4 would be Forest[1][0]
 */
type Forest = Tree[][];

const parseInput = (input: string): Forest => {
	const result: Forest = [];
	const lines = input.split("\n");
	lines.pop(); // drop empty line

	lines.forEach((line, y) => {
		result[y] = line.split("").map((t, x) => {
			return {
				height: parseInt(t, 10),
				x,
				y,
			} as Tree;
		});
	});

	return result;
};

const printForest = (f: Forest): void => {
	let result = "";
	f.forEach((row) => {
		row.forEach((tree) => (result += tree.height));
		result += "\n";
	});
	console.log(result);
};

const isPerimeter = (t: Tree, forest: Forest): boolean => {
	const { x, y } = t;
	if (x === 0 || y === 0) return true;
	if (y === forest.length - 1) return true;
	if (x === forest[y].length - 1) return true;
	return false;
};

enum DIR {
	UP = "UP",
	DOWN = "DOWN",
	LEFT = "LEFT",
	RIGHT = "RIGHT",
}

const getTreeInDir = (base: Tree, forest: Forest, dir: DIR): Tree | null => {
	switch (dir) {
		case DIR.UP:
			if (base.y === 0) return null;
			return forest[base.y - 1][base.x];
		case DIR.DOWN:
			if (base.y === forest.length - 1) return null;
			return forest[base.y + 1][base.x];
		case DIR.LEFT:
			if (base.x === 0) return null;
			return forest[base.y][base.x - 1];
		case DIR.RIGHT:
			if (base.x === forest[base.y].length - 1) return null;
			return forest[base.y][base.x + 1];
	}
};

const isVisibleInDir = (tree: Tree, forest: Forest, dir: DIR): boolean => {
	let next: Tree | null = tree;
	while ((next = getTreeInDir(next, forest, dir))) {
		if (next.height >= tree.height) return false;
	}
	return true;
};

const isVisible = (tree: Tree, forest: Forest): boolean => {
	if (isPerimeter(tree, forest)) return true;

	const dirs = [DIR.UP, DIR.DOWN, DIR.LEFT, DIR.RIGHT];
	for (const dir of dirs) {
		if (isVisibleInDir(tree, forest, dir)) return true;
	}
	return false;
};

export const solve = (input: string): number => {
	const forest = parseInput(input);
	// printForest(forest);
	let total = 0;
	forest.forEach((row) => {
		row.forEach((tree) => {
			const iv = isVisible(tree, forest);
			if (iv) total++;
		});
	});
	return total;
};
