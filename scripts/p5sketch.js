
let _col_background;
let _col_gridLines;

let _gridWidth = 90;
let _gridHeight = 40;

const _cellSize = 10;
const _canvasWidth = _cellSize * _gridWidth;
const _canvasHeight = _cellSize * _gridHeight;

class Grid {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.mat = [];
		for (let c = 0; c < this.width; c++) {
			this.mat[c] = [];
			for (let r = 0; r < this.height; r++) {
				this.mat[c][r] = 0;
			}
		}
	}

	get(c, r) {
		if (c < 0 || c >= this.width || r < 0 || r >= this.height) {
			return -1;
		} else {
			return this.mat[c][r];
		}
	}

	set(c, r, val) {
		if (c < 0 || c >= this.width || r < 0 || r >= this.height) {
			return;
		} else {
			this.mat[c][r] = val;
		}
	}

	copyFrom(other) {
		for (let c = 0; c < this.width; c++) {
			for (let r = 0; r < this.height; r++) {
				this.mat[c][r] = other.get(c, r);
			}
		}
	}
}

let mainGrid = new Grid(_gridWidth, _gridHeight);
let oldGrid = new Grid(_gridWidth, _gridHeight);

let _clockInterval = 3;
let clock;

function setup() {
	createCanvas(_canvasWidth, _canvasHeight);

	_col_background = color(9, 9, 30);
	_col_gridLines = color(150, 150, 250);

	clock = 0;
	
	mainGrid.set(1, 1, 1);
	mainGrid.set(5, 3, 1);
	oldGrid.copyFrom(mainGrid);
}

function draw() {
	if (clock >= _clockInterval) {
		updateGrid();
		clock = 0;
	}
	clock++;

	background(_col_background);
	
	for (let c = 0; c < _gridWidth; c++) {
		for (let r = 0; r < _gridHeight; r++) {
			strokeWeight(1);
			stroke(_col_gridLines);

			if (mainGrid.get(c, r) == 1) {
				fill(color(255, 0, 0));
			} else {
				noFill();
			}

			rect(c * _cellSize, r * _cellSize, _cellSize, _cellSize);
		}
	}
}

function updateGrid() {
	for (let c = 0; c < _gridWidth; c++) {
		for (let r = 0; r < _gridHeight; r++) {
			if (oldGrid.get(c, r) == 1) {
				mainGrid.set(c + 1, r + 1, 1);
				mainGrid.set(c, r, 0);
			}
		}
	}

	oldGrid.copyFrom(mainGrid);
}
