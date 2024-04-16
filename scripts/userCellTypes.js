
userCellTypesList = [
	["Conway", "#F0C800", function(grid, c, r, cellNone, cellMe, cellOthers) {
		return grid.get(c, r) == cellMe || grid.get(c - 1, r) == cellMe || grid.get(c + 1, r) == cellMe;
	}]
];
