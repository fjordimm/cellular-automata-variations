
let _col_background;
let _col_gridLines;

let _gridWidth = 60;
let _gridHeight = 30;

const _canvasWidth = window.innerWidth * 0.6;
const _canvasHeight = _canvasWidth * 0.5;

let _cellSize = Math.min(_canvasWidth / _gridWidth, _canvasHeight / _gridHeight);

class CellType {
	constructor(id, name, color, ruleset) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.ruleset = ruleset;
	}
}

class CellTypes {
	static total = 0;
	static list = [];

	static addCellType(name, color, ruleset) {
		const cellType = new CellType(this.total, name, color, ruleset);
		this.list[this.total] = cellType;
		this.total++;

		this.addCellTypeToRadio(cellType);
	}

	static addCellTypeToRadio(cellType) {
		const form = document.getElementById("form-paint-radio");

		const input = document.createElement("input");
		input.id = `paint-radio-${cellType.name}`;
		input.type = "radio";
		input.name = "paint-radio";
		input.value = cellType.name;
		form.appendChild(document.createTextNode(" "));
		form.appendChild(input);

		const label = document.createElement("label");
		label.htmlFor = input.id;
		label.innerHTML = cellType.name;
		form.appendChild(document.createTextNode(" "));
		form.appendChild(label);

		const colorLabel = document.createElement("div");
		colorLabel.classList.add("color-label");
		colorLabel.style.backgroundColor = cellType.color;
		form.appendChild(document.createTextNode(" "));
		form.appendChild(colorLabel);

		form.appendChild(document.createTextNode(" "));
		form.appendChild(document.createElement("br"));
	}

	static getCellColor(index) {
		return this.list[index].color;
	}

	static {
		this.addCellType("None", "rgb(25, 30, 35)");
		document.getElementById("paint-radio-None").setAttribute("checked", true)

		for (let i = 0; i < userCellTypesList.length; i++) {
			const cellTypeParams = userCellTypesList[i];
			this.addCellType(cellTypeParams[0], cellTypeParams[1], cellTypeParams[2]);
		}
	}
}

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

let genCount;
let gridHistory;

let gameStarted;
let startedDrawingCells;
let clock;

function getClockInterval(x) { return Math.floor(100 * Math.exp((x - 1) / 100 * Math.log(1/100))) }
let clockInterval = getClockInterval(document.getElementById("speed-slider").value);
document.getElementById("speed-slider").oninput = function() { clockInterval = getClockInterval(this.value); }

let cellColors;

function setup() {
	createCanvas(_canvasWidth, _canvasHeight);

	_col_background = color(25, 30, 35);
	_col_gridLines = color(0, 0, 0);

	cellColors = [];
	for (let i = 0; i < CellTypes.total; i++) {
		cellColors[i] = color(CellTypes.getCellColor(i));
	}
	
	mainGrid.set(1, 1, 1);
	mainGrid.set(5, 3, 1);
	oldGrid.copyFrom(mainGrid);

	genCount = 0;
	gridHistory = [];
	gridHistory[0] = new Grid(_gridWidth, _gridHeight);
	gridHistory[0].copyFrom(mainGrid);

	gameStarted = false;
	startedDrawingCells = false;
	clock = 0;

	drawGrid();
}

function draw() {
	if (mouseIsPressed && (mouseX >= 0 && mouseX <= _canvasWidth && mouseY >= 0 && mouseY <= _canvasHeight)) {
		startedDrawingCells = true;

		let c = Math.floor(mouseX / _cellSize);
		let r = Math.floor(mouseY / _cellSize);
		mainGrid.set(c, r, 1);

		drawGrid();
	} else if (gameStarted) {
		if (clock >= clockInterval) {
			nextGrid();
			drawGrid();
			clock = 0;
		}
		clock++;
	}
}

function mouseReleased() {
	if (!startedDrawingCells) return;
	dummyNextGrid();
	startedDrawingCells = false;
}

function drawGrid() {
	background(_col_background);
	
	noStroke();
	for (let c = 0; c < _gridWidth; c++) {
		for (let r = 0; r < _gridHeight; r++) {
			let cellId = mainGrid.get(c, r);
			if (cellId < 0 || cellId > cellColors.length) {
				throw new Error("Invalid cell id!");
			} else if (cellId != 0) {
				fill(cellColors[cellId]);
				rect(c * _cellSize, r * _cellSize, _cellSize, _cellSize);
			}
		}
	}

	strokeWeight(1);
	stroke(_col_gridLines);
	for (let c = 0; c < _gridWidth + 1; c++) {
		line(c * _cellSize, 0, c * _cellSize, _canvasHeight);
	}
	for (let r = 0; r < _gridHeight + 1; r++) {
		line(0, r * _cellSize, _canvasWidth, r * _cellSize);
	}
}

function nextGrid() {
	for (let c = 0; c < _gridWidth; c++) {
		for (let r = 0; r < _gridHeight; r++) {
			if (oldGrid.get(c, r) == 1) {
				mainGrid.set(c + 1, r + 1, 1);
				mainGrid.set(c, r, 0);
			}
		}
	}

	oldGrid.copyFrom(mainGrid);

	genCount++;
	document.getElementById("gen-count").innerHTML = genCount;

	gridHistory[genCount] = new Grid(_gridWidth, _gridHeight);
	gridHistory[genCount].copyFrom(mainGrid);

	document.getElementById("prev-button").disabled = false;
}

function dummyNextGrid() {
	genCount++;
	document.getElementById("gen-count").innerHTML = genCount;

	gridHistory[genCount] = new Grid(_gridWidth, _gridHeight);
	gridHistory[genCount].copyFrom(mainGrid);
	oldGrid.copyFrom(mainGrid);

	document.getElementById("prev-button").disabled = false;
}

function prevGrid() {
	gridHistory.pop();

	genCount--;
	document.getElementById("gen-count").innerHTML = genCount;

	if (genCount <= 0) {
		document.getElementById("prev-button").disabled = true;
	}

	mainGrid.copyFrom(gridHistory[genCount]);
	oldGrid.copyFrom(gridHistory[genCount]);
}

function resetGrid() {
	gridHistory = [gridHistory[0]];

	genCount = 0;
	document.getElementById("gen-count").innerHTML = genCount;

	document.getElementById("prev-button").disabled = true;

	mainGrid.copyFrom(gridHistory[genCount]);
	oldGrid.copyFrom(gridHistory[genCount]);
}

function saveGrid() {
	gridHistory = [gridHistory[genCount]];

	genCount = 0;
	document.getElementById("gen-count").innerHTML = genCount;

	document.getElementById("prev-button").disabled = true;

	mainGrid.copyFrom(gridHistory[genCount]);
	oldGrid.copyFrom(gridHistory[genCount]);
}

document.getElementById("prev-button").onclick = function() {
	prevGrid();
	drawGrid();
}

document.getElementById("start-button").onclick = function() {
	if (document.getElementById("start-checkbox").checked == false) {
		gameStarted = true;
		document.getElementById("start-checkbox").checked = true;
	} else {
		gameStarted = false;
		document.getElementById("start-checkbox").checked = false;
	}
}

document.getElementById("next-button").onclick = function() {
	nextGrid();
	drawGrid();
}

document.getElementById("reset-button").onclick = function() {
	resetGrid();
	drawGrid();
}

document.getElementById("save-button").onclick = function() {
	saveGrid();
	drawGrid();
}

document.getElementById("clear-button").onclick = function() {
	for (let c = 0; c < _gridWidth; c++) {
		for (let r = 0; r < _gridHeight; r++) {
			mainGrid.set(c, r, 0);
		}
	}
	dummyNextGrid();

	drawGrid();
}

// console.log(document.forms['form-paint-radio']['paint-radio'].value);
