import pointerTracker from "../_shared/tracker.js";
import {createMatrix} from "../_shared/matrix.js";
import {randomInt} from "../_shared/math.js";
import {sleep} from "../_shared/util.js";
import {shapes, symbols} from "./tiles.js";
import config from "./config.js";

const canvas = document.querySelector('canvas');
canvas.width = 700;
canvas.height = 700;

const g = canvas.getContext('2d');

const nRows = 8;
const nCols = 8;
const blank = 12;
const baseThreshold = 250;
const symbolChars = symbols.split('');
const States = {
    Start: 'Start',
    Solving: 'Solving',
    Done: 'Done',
    Failed: 'Fail',
}

let grid, placed, animationFrameCounter, state, numSquaresSelected, snapshotThreshold;

pointerTracker(canvas, async function (eventType, x, y) {
    switch (eventType) {

        case 'down':
            if (state === States.Failed || state === States.Done) {
                state = States.Start;
                init();
                draw('Select 4 squares');
                break;
            }
            if (state === States.Start) {
                if (selectSquare(x, y)) {
                    if (numSquaresSelected === 4) {
                        await run();
                    }
                }
            }
            break;
    }
});

function init() {
    state = States.Start;
    animationFrameCounter = 0;
    snapshotThreshold = baseThreshold;
    numSquaresSelected = 0;
    grid = createMatrix(nRows, nCols, -1);
    placed = new Array(symbols.length - 1);
    shuffleShapes();
}

function shuffleShapes() {
    let n = shapes.length;
    while (n > 1) {
        const r = randomInt(n--);

        const tmp = shapes[r];
        shapes[r] = shapes[n];
        shapes[n] = tmp;

        const tmpSymbol = symbolChars[r];
        symbolChars[r] = symbolChars[n];
        symbolChars[n] = tmpSymbol;
    }
}

function selectSquare(x, y) {
    if (numSquaresSelected < 4 && withinBounds(x, y)) {
        const c = Math.floor((x - config.leftmargin) / config.tileSize);
        const r = Math.floor((y - config.topmargin) / config.tileSize);
        if (grid[r][c] === -1) {
            numSquaresSelected++;
            grid[r][c] = blank;
            draw('Select ' + (4 - numSquaresSelected) + ' squares');
            return true;
        }
    }
    return false;
}

function withinBounds(x, y) {
    return (
        x >= config.leftmargin && x < config.leftmargin + nCols * config.tileSize &&
        y >= config.topmargin && y < config.topmargin + nRows * config.tileSize
    );
}

function tryPlaceOrientation(o, r, c, shapeIndex) {

    for (let i = 0; i < o.length; i += 2) {
        const x = c + o[i + 1];
        const y = r + o[i];
        if (x < 0 || x >= nCols || y < 0 || y >= nRows || grid[y][x] !== -1)
            return false;
    }

    grid[r][c] = shapeIndex;
    for (let i = 0; i < o.length; i += 2)
        grid[r + o[i]][c + o[i + 1]] = shapeIndex;

    return true;
}

function removeOrientation(o, r, c) {
    grid[r][c] = -1;
    for (let i = 0; i < o.length; i += 2)
        grid[r + o[i]][c + o[i + 1]] = -1;
}

async function solve(pos, numPlaced) {
    if (numPlaced === shapes.length)
        return true;

    const row = Math.floor(pos / nCols);
    const col = Math.floor(pos % nCols);

    if (grid[row][col] !== -1)
        return solve(pos + 1, numPlaced);

    for (let i = 0; i < shapes.length; i++) {
        if (!placed[i]) {
            for (const orientation of shapes[i]) {

                if (!tryPlaceOrientation(orientation, row, col, i))
                    continue;

                placed[i] = true;

                await animate();

                if (await solve(pos + 1, numPlaced + 1))
                    return true;

                await animate();

                removeOrientation(orientation, row, col);
                placed[i] = false;
            }
        }
    }
    return false;
}

async function animate() {
    if (animationFrameCounter % snapshotThreshold === 0) {
        draw();
        await sleep(100);
    }
    animationFrameCounter++;
    snapshotThreshold = Math.ceil(animationFrameCounter / 25000) * baseThreshold;
}

function drawGrid() {
    let x = config.leftmargin, y = config.topmargin;
    for (const row of grid) {
        for (const i of row) {
            g.strokeStyle = config.gridColor;
            g.strokeRect(x, y, config.tileSize, config.tileSize);
            if (i !== -1) {
                g.fillStyle = config.colors[i];
                g.fillRect(x, y, config.tileSize, config.tileSize);
                g.strokeStyle = config.strokeColor;
                g.strokeRect(x, y, config.tileSize, config.tileSize);
            }
            x += config.tileSize;
        }
        x = config.leftmargin;
        y += config.tileSize;
    }
}

function drawMessage(message) {
    if (message !== 'none') {
        g.font = config.font;
        g.fillStyle = config.textColor;
        g.textAlign = 'center';
        g.fillText(message, canvas.width / 2, canvas.height - 10);
    }
}

function draw(message = 'none') {
    g.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawMessage(message);
}

async function run() {
    state = States.Solving;
    if (await solve(0, 0)) {
        state = States.Done;
        draw('click to start over');
    } else {
        state = States.Failed;
        draw('No solution. Click to start over');
    }
}

init();
draw('Select 4 squares');
