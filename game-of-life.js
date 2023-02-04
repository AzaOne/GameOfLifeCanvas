const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const randomButton = document.getElementById('random-button');
const clearButton = document.getElementById('clear-button');
const generationCount = document.getElementById('generation');
const stepButton = document.getElementById('step-button');

let cellSize = 10;
let simulationInterval;

let rows = canvas.height / cellSize;
let columns = canvas.width / cellSize;

let grid = [];

//initialize grid
function init() {
  drawGrid();
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < columns; j++) {
      grid[i][j] = 0;
    }
  }
}
init();

// initialize random grid
function random() {
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < columns; j++) {
      grid[i][j] = Math.round(Math.random());
    }
  }
}

// Draw the grid
function drawGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      ctx.strokeStyle = "lightgrey";
      ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}

// Draw the cells
function draw() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (grid[i][j] == 1) {
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  }
  drawGrid();
}

// Calculate the next generation of the grid
function nextGeneration() {
  let nextGrid = [];
  for (let i = 0; i < rows; i++) {
    nextGrid[i] = [];
    for (let j = 0; j < columns; j++) {
      let neighbors = 0;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if (x === 0 && y === 0) {
            continue;
          }
          let row = i + x;
          let col = j + y;
          if (row >= 0 && row < rows && col >= 0 && col < columns) {
            neighbors += grid[row][col];
          }
        }
      }
      if (grid[i][j] === 1 && (neighbors === 2 || neighbors === 3)) {
        nextGrid[i][j] = 1;
      } else if (grid[i][j] === 0 && neighbors === 3) {
        nextGrid[i][j] = 1;
      } else {
        nextGrid[i][j] = 0;
      }
    }
  }
  grid = nextGrid;
}

//stop the simulation
function stop() {
  clearInterval(simulationInterval);
  simulationInterval = null;
  startButton.innerHTML = "Start";
}

// Event listeners

randomButton.addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  random();
  draw();
  stop();
  generationCount.innerHTML = 0;
});

clearButton.addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  init();
  draw();
  stop();
  generationCount.innerHTML = 0;
});

startButton.addEventListener("click", function () {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    startButton.innerHTML = "Start";
  } else {
    simulationInterval = setInterval(function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      generationCount.innerHTML = parseInt(generationCount.innerHTML) + 1;
      nextGeneration();
      draw();
    }, 100);
    startButton.innerHTML = "Stop";
  }
});

stepButton.addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  generationCount.innerHTML = parseInt(generationCount.innerHTML) + 1;
  nextGeneration();
  draw();
});

canvas.addEventListener("click", function (event) {
  stop();
  let x = event.offsetX;
  let y = event.offsetY;
  let row = Math.floor(y / cellSize);
  let col = Math.floor(x / cellSize);
  if (grid[row][col] === 1) {
    grid[row][col] = 0;
  } else {
    grid[row][col] = 1;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
});
