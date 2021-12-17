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

const WALL = -2;
const MAX_ENERGY = 1500;
const nRows = 60;
const nCols = 75;
const treats = [];

let snake;
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
    console.log(0);

    if (isGameOver) {
        startNewGame();
        console.log(1);
    }
});

addEventListener('keyup', function () {
    keyDown = false;
});

function Snake(x, y, e) {
    this.body = [
        { x: x, y: y },
        { x: x + 1, y: y },
        { x: x + 2, y: y },
        { x: x + 3, y: y },
        { x: x + 4, y: y }
    ];

    this.energy = e;

    this.resetEnergy = function () {
        this.energy = MAX_ENERGY;
    }

    this.energyUsed = function () {
        this.energy -= 10;
        return this.energy <= 0;
    }

    this.nextPosition = function () {
        const head = this.body[0];
        return { x: head.x + dir.x, y: head.y + dir.y };
    }

    this.hitsWall = function () {
        const pos = this.nextPosition();
        return grid[pos.y][pos.x] === WALL;
    }

    this.hitsSelf = function () {
        const pos = this.nextPosition();
        return this.body.some(function (p) {
            return (p.x === pos.x && p.y === pos.y)
        });
    }

    this.eat = function () {
        const pos = this.nextPosition();
        return treats.some(function (t, i) {
            if (t.x === pos.x && t.y === pos.y) {
                treats.splice(i, 1);
                return true;
            }
            return false;
        });
    }

    this.grow = function () {
        const tail = this.body[this.body.length - 1];
        const x = tail.x + dir.x;
        const y = tail.y + dir.y;
        this.body.push({ x: x, y: y });
    }

    this.move = function () {
        for (let i = this.body.length - 1; i > 0; i--) {
            const p1 = this.body[i - 1];
            const p2 = this.body[i];
            p2.x = p1.x;
            p2.y = p1.y;
        }
        const head = this.body[0];
        head.x += dir.x;
        head.y += dir.y;
    }
}

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
    snake.body.forEach(function (p) {
        g.fillRect(p.x * 10, p.y * 10, 10, 10);
    });

    g.fillStyle = snake.energy < 500 ? "red" : "orange";
    const head = snake.body[0];
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
    g.fillText("energy  " + snake.energy, 600, 570);
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

function fillRect(r, color) {
    g.fillStyle = color;
    g.fillRect(r.x, r.y, r.w, r.h);
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

        if (snake.energyUsed() || snake.hitsWall() || snake.hitsSelf()) {
            gameOver(requestId);
        } else {
            if (snake.eat()) {
                score++;
                snake.resetEnergy();
                snake.grow();
            }
            snake.move();
            addTreat();
        }
        draw();
        lastFrameTime = time;
    }
}

function gameOver(id) {
    isGameOver = true;
    cancelAnimationFrame(id);
    console.log("over");
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

                    if (contains(snake.body, x, y) || contains(treats, x, y))
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
    snake = new Snake(Math.floor(nCols / 2), Math.floor(nRows / 2), MAX_ENERGY);

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
