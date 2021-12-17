import Snake, {WALL} from "./snake.js";
import config from "./config.js";

'use strict';
const canvas = document.querySelector('canvas');
canvas.width = 750;
canvas.height = 600;

const g = canvas.getContext('2d');

const right = { x: 1, y: 0 };
const down = { x: 0, y: 1 };
const left = { x: -1, y: 0 };
const up = { x: 0, y: -1 };

const snakepit = { x: 0, y: 0, w: 750, h: 600 };

const nRows = 60;
const nCols = 75;
const treats = [];

let main;
let grid;
let dir;
let keyDown = false;
let isGameOver = true;
let score = 0;
let hiscore = 0;

addEventListener('keydown', function (event) {
    if (!keyDown) {
        keyDown = true;

        switch (event.key) {

            case 'w':
            case 'ArrowUp':
                if (dir !== down)
                    dir = up;
                break;

            case 'a':
            case 'ArrowLeft':
                if (dir !== right)
                    dir = left;
                break;

            case 'd':
            case 'ArrowRight':
                if (dir !== left)
                    dir = right;
                break;

            case 's':
            case 'ArrowDown':
                if (dir !== up)
                    dir = down
                break;
        }
        draw();
    }
});

addEventListener('click', function () {
    if (isGameOver) {
        startNewGame();
    }
});

addEventListener('keyup', function () {
    keyDown = false;
});

function draw() {
    g.clearRect(0, 0, canvas.width, canvas.height);

    drawSnakepit();
    drawGrid();

    if (isGameOver) {
        drawStartScreen();
    } else {
        drawSnake();
        drawTreats();
        drawScore();
    }
}

function drawStartScreen() {
    g.fillStyle = "blue";
    g.font = config.mainFont;
    g.fillText("Snake", 200, 200);

    g.fillStyle = "orange";
    g.font = config.smallFont;
    g.fillText("(click to start)", 330, 400);
}

function drawSnakepit() {
    g.lineWidth = 10;
    drawRect(snakepit, config.borderColor);
}

function drawSnake() {
    g.fillStyle = "blue";
    main.body.forEach(function (p) {
        g.fillRect(p.x * 10, p.y * 10, 10, 10);
    });

    g.fillStyle = main.energy < 500 ? "red" : "orange";
    const head = main.body[0];
    g.fillRect(head.x * 10, head.y * 10, 10, 10);
}

function drawTreats() {
    g.fillStyle = "green";
    treats.forEach(function (t) {
        g.fillRect(t.x * 10, t.y * 10, 10, 10);
    });
}

function drawScore() {
    g.fillStyle = "black";
    g.font = config.smallFont;

    g.fillText("hiscore  " + hiscore, 30, 570);
    g.fillText("score  " + score, 150, 570);
    g.fillText("energy  " + main.energy, 600, 570);
}

function drawGrid() {
    g.fillStyle = "purple";
    for (let r = 0; r < nRows; r++) {
        for (let c = 0; c < nCols; c++) {
            if (grid[r][c] === WALL)
                g.fillRect(c * 10, r * 10, 10, 10);
        }
    }
}

function drawRect(r, color) {
    g.strokeStyle = color;
    g.strokeRect(r.x, r.y, r.w, r.h);
}

function animate(lastFrameTime) {
    const requestId = requestAnimationFrame(function () {
        animate(lastFrameTime);
    });

    const time = new Date().getTime();
    const delay = Math.max(150 - score, 25);

    if (lastFrameTime + delay < time) {

        if (main.energyUsed() || main.hitsWall(grid, dir) || main.hitsSelf(dir)) {
            gameOver(requestId);
        } else {
            if (main.eat(treats, dir)) {
                score++;
                main.resetEnergy();
                main.grow(dir);``
            }
            main.move(dir);
            addTreat();
        }
        draw();
        lastFrameTime = time;
    }
}

function gameOver(id) {
    isGameOver = true;
    cancelAnimationFrame(id);
}

function initGrid() {
    grid = new Array(nRows);
    for (let r = 0; r < nRows; r++) {
        grid[r] = new Array(nCols);
        for (let c = 0; c < nCols; c++) {
            if (c === 0 || c === nCols - 1 || r === 0 || r === nRows - 1) {
                grid[r][c] = WALL;
            } else {
                grid[r][c] = 0;
            }
        }
    }
}

function addTreat() {

    function contains(arr, x, y) {
        return arr.some(function (elem) {
            return elem.x === x && elem.y === y;
        });
    }

    if (treats.length < 3) {

        if (Math.random() < 0.1) { // 1 in 10

            if (Math.random() < 0.75) {  // 3 in 4

                while (true) {

                    const x = Math.floor(Math.random() * nCols);
                    const y = Math.floor(Math.random() * nRows);
                    if (grid[y][x] !== 0)
                        continue;

                    if (contains(main.body, x, y) || contains(treats, x, y))
                        continue;

                    treats.push({ x: x, y: y });
                    break;
                }
            } else if (treats.length > 1) {
                treats.shift();
            }
        }
    }
}

function startNewGame() {
    dir = left;
    isGameOver = false;
    initGrid();
    main = new Snake(Math.floor(nCols / 2), Math.floor(nRows / 2));

    if (score > hiscore) {
        hiscore = score;
    }
    score = 0;

    do {
        addTreat();
    } while (!treats.length);

    animate(0);
}

initGrid();
draw();
