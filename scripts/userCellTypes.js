
userCellTypesList = [
	["Conway", "#F0C800", function(grid, c, r, cellNone, cellMe, cellOthers) {
		let isMe = grid.get(c, r) == cellMe;

		function isCool(x) {
			return x == cellMe || x == cellOthers.getCellTypeId("Schmonway");
		}

		let count = 0;
		if (isCool(grid.get(c - 1, r - 1))) count++;
		if (isCool(grid.get(c + 0, r - 1))) count++;
		if (isCool(grid.get(c + 1, r - 1))) count++;
		if (isCool(grid.get(c - 1, r + 0))) count++;
		if (isCool(grid.get(c + 1, r + 0))) count++;
		if (isCool(grid.get(c - 1, r + 1))) count++;
		if (isCool(grid.get(c + 0, r + 1))) count++;
		if (isCool(grid.get(c + 1, r + 1))) count++;

		if (count <= 1) return false;
		if (count == 2) return isMe;
		if (count == 3) return true;
		if (count >= 4) return false;
	}],
	["Schmonway", "#E03050", function(grid, c, r, cellNone, cellMe, cellOthers) {
		let isMe = grid.get(c, r) == cellMe;

		return isMe;
	}],
	["CoolThingA", "#0080E0", function(grid, c, r, cellNone, cellMe, cellOthers) {
		let isMe = grid.get(c, r) == cellMe;

		function isCool(x) {
			return x == cellMe;
		}

		let count = 0;
		for (let cc = c - 2; cc <= c + 2; cc++) {
			for (let rr = r - 2; rr <= r + 2; rr++) {
				if (!(cc == c && rr == r)) {
					if (isCool(grid.get(cc, rr))) count++;
				}
			}
		}

		if (count <= 3) return false;
		if (count == 4) return true;
		if (count >= 5) return false;
	}]
];
