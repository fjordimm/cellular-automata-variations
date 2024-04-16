
userCellTypesList = [
	["Conway", "#F0C800", function(grid, c, r, cellNone, cellMe, cellOthers) {
		// return grid.get(c, r) == cellMe || grid.get(c - 1, r) == cellMe || grid.get(c + 1, r) == cellMe;

		let isMe = grid.get(c, r) == cellMe;

		let count = 0;
		if (grid.get(c - 1, r - 1) == cellMe) count++;
		if (grid.get(c + 0, r - 1) == cellMe) count++;
		if (grid.get(c + 1, r - 1) == cellMe) count++;
		if (grid.get(c - 1, r + 0) == cellMe) count++;
		if (grid.get(c + 1, r + 0) == cellMe) count++;
		if (grid.get(c - 1, r + 1) == cellMe) count++;
		if (grid.get(c + 0, r + 1) == cellMe) count++;
		if (grid.get(c + 1, r + 1) == cellMe) count++;

		if (count <= 1) return false;
		if (count == 2) return isMe;
		if (count == 3) return true;
		if (count >= 4) return false;
	}]
];
