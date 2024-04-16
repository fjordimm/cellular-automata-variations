
let _col_background;
let _col_gridLines;

let _gridWidth = 90;
let _gridHeight = 40;

const _cellSize = 10;
const _canvasWidth = _cellSize * _gridWidth;
const _canvasHeight = _cellSize * _gridHeight;

let grid = [];
function gridSetup() {
	for (let c = 0; c < _gridWidth; c++) {
		grid[c] = [];
		for (let r = 0; r < _gridHeight; r++) {
			grid[c][r] = 0;
		}
	}

	grid[1][1] = 1;
	grid[2][3] = 1;
}
gridSetup();

let oldGrid = [];
for (let i = 0; i < _gridWidth; i++) oldGrid[i] = [];
function copyGrid(a, b) {
	for (let c = 0; c < a.length; c++) {
		for (let r = 0; r < a[0].length; r++) {
			b[c][r] = a[c][r];
		}
	}
}

let _clockInterval = 1;
let clock;

function setup() {
	createCanvas(_canvasWidth, _canvasHeight);

	_col_background = color(9, 9, 30);
	_col_gridLines = color(150, 150, 250);

	clock = 0;
	copyGrid(grid, oldGrid);
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

			if (grid[c][r] == 1) {
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
			if (oldGrid[c][r] == 1) {
				grid[c + 1][r] = 1;
				grid[c][r] = 0;
			}
		}
	}

	copyGrid(grid, oldGrid);
}
