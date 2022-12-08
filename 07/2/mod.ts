interface File {
	parent?: Dir;
	size?: number;
	name: string;
}

interface Dir extends File {
	contents: Dir[];
}

const getOrCreateDir = (name: string, parent: Dir): Dir => {
	let childDir = parent.contents.find((c) => c.name == name && c.contents);
	if (!childDir) {
		childDir = {
			name,
			parent,
			contents: [],
		};
		parent.contents.push(childDir);
	}
	return childDir;
};

const addSize = (dir: Dir, size: number) => {
	if (!dir.size) dir.size = 0;
	dir.size += size;
	if (dir.parent) {
		addSize(dir.parent, size);
	}
};

const getOrCreateFile = (parent: Dir, name: string, size: number): File => {
	let file = parent.contents.find((c) => c.name == name && !c.contents) as File;
	if (!file) {
		file = {
			name,
			parent,
			size,
		};
		parent.contents.push(file as Dir);
		addSize(parent, size);
	}
	return file;
};

const parseInput = (inputs: string[], fs: Dir, root: Dir) => {
	const i = inputs.shift();
	if (!i) return; // empty case
	let dir = fs;
	const [prefix, command, arg] = i.split(" ");
	if (prefix !== "$") {
		throw new Error("ParseInput encountered first line with non $");
	}
	if (command === "cd") {
		if (arg == "..") {
			if (!dir.parent) throw new Error('attmept to "cd .." from root');
			dir = dir.parent;
		} else if (arg == "/") {
			dir = root;
		} else {
			dir = getOrCreateDir(arg, dir);
		}
	} else if (command === "ls") {
		while (inputs.length && inputs[0][0] !== "$") {
			const line = inputs.shift();
			if (!line) throw new Error("dang, things went real bad");
			if (line?.indexOf("dir") === 0) {
				getOrCreateDir(line.slice(4), dir);
			} else {
				const [sizeStr, name] = line?.split(" ");
				const size = parseInt(sizeStr, 10);
				getOrCreateFile(dir, name, size);
			}
		}
	}

	parseInput(inputs, dir, root);
};

const findDirs = (root: Dir): Dir[] => {
	const result: Dir[] = [];
	root.contents.forEach((c) => {
		if (!c.contents) return;
		result.push(c);
		result.push(...findDirs(c));
	});
	return result;
};

export const solve = (input: string): number => {
	const [start, ...rest] = input.split("\n");
	if (start !== "$ cd /") throw new Error("Invalid first line");
	const d: Dir = {
		name: "/",
		contents: [],
	};
	rest.pop(); // remove empty line
	parseInput(rest, d, d);

	const spaceUsed = d.size || 0;
	const spaceAvailable = 70000000 - spaceUsed;
	const spaceNeeded = 30000000;
	const spaceToFind = spaceNeeded - spaceAvailable;

	let smallestToDelete = 70000000;
	const dirs = [d, ...findDirs(d)];
	dirs.forEach((d) => {
		if (!d.size) return;
		if (d.size > spaceToFind && d.size < smallestToDelete) {
			smallestToDelete = d.size;
		}
	});
	return smallestToDelete;
};
