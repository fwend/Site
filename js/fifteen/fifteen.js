import mouseTracker from "../_shared/tracker.js";

const canvas = document.querySelector('canvas');
canvas.width = 700;
canvas.height = 750;

const g = canvas.getContext('2d');

const side = 4;
const numTiles = side * side - 1;
const tileSize = canvas.width / side;
const gridSize = tileSize * side;
const tiles = Array(side * side);

let gameOver = true;
let blankPos = 0;

const image = new Image();
image.src = "../img/hamburger.png";

g.font = '20px sans-serif';


mouseTracker(canvas, function(eventType, x, y) {
    switch (eventType) {

        case 'down':
            handleMouseDown(x, y);
            break;
    }
});

function handleMouseDown(ex, ey) {
    if (gameOver) {
        newGame();

    } else {

        if (ex < 0 || ex > gridSize || ey < 0 || ey > gridSize) {
            return;
        }

        const c1 = Math.floor(ex / tileSize);
        const r1 = Math.floor(ey / tileSize);
        const c2 = blankPos % side;
        const r2 = Math.floor(blankPos / side);

        const clickPos = r1 * side + c1;

        let dir = 0;
        if (c1 === c2 && Math.abs(r1 - r2) > 0) {
            dir = (r1 - r2) > 0 ? 4 : -4;

        } else if (r1 === r2 && Math.abs(c1 - c2) > 0) {
            dir = (c1 - c2) > 0 ? 1 : -1;
        }

        if (dir !== 0) {
            do {
                const newBlankPos = blankPos + dir;
                tiles[blankPos] = tiles[newBlankPos];
                blankPos = newBlankPos;
            } while (blankPos !== clickPos);
            tiles[blankPos] = 0;
        }

        gameOver = isSolved();
    }
    drawGrid();
}

function newGame() {
    do {
        init();
        shuffle();
    } while (!isSolvable());
    gameOver = false;
    drawGrid();
}

function init() {
    for (let i = 0; i < tiles.length; i++) {
        tiles[i] = (i + 1) % tiles.length;
    }
    blankPos = tiles.length - 1;
}

/*  Only half the permutations of the puzzle are solvable.

    Whenever a tile is preceded by a tile with higher value it counts
    as an inversion. In our case, with the blank space in the home
    position, the number of inversions must be even for the puzzle
    to be solvable.
 */
function isSolvable() {
    let countInversions = 0;
    for (let i = 0; i < numTiles; i++) {
        for (let j = 0; j < i; j++) {
            if (tiles[j] > tiles[i]) {
                countInversions++;
            }
        }
    }
    return countInversions % 2 === 0;
}

function isSolved() {
    if (tiles[tiles.length - 1] !== 0) {
        return false;
    }
    for (let i = numTiles - 1; i >= 0; i--) {
        if (tiles[i] !== i + 1) {
            return false;
        }
    }
    return true;
}

function shuffle() {
    // don't include the blank space in the shuffle, leave it
    // in the home position
    let n = numTiles;
    while (n > 1) {
        const r = Math.floor(Math.random() * n--);
        const tmp = tiles[r];
        tiles[r] = tiles[n];
        tiles[n] = tmp;
    }
}

function drawGrid() {
    g.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < tiles.length; i++) {
        const r = Math.floor(i / side);
        const c = Math.floor(i % side);
        const x = c * tileSize;
        const y = r * tileSize;

        if (tiles[i] === 0) {
            if (gameOver) {
                const cropxy = (side - 1) * tileSize;
                drawTile(cropxy, cropxy, tileSize, tileSize, x, y, tileSize, tileSize);
                drawStartText();
            } else {
                g.fillStyle = 'gray';
                g.fillRect(x, y, tileSize, tileSize);
                g.strokeRect(x, y, tileSize, tileSize);
            }
        } else {
            const cropx = Math.floor((tiles[i] - 1) % side) * tileSize;
            const cropy = Math.floor((tiles[i] - 1) / side) * tileSize;
            drawTile(cropx, cropy, tileSize, tileSize, x, y, tileSize, tileSize);
        }
    }
}

function drawStartText() {
    g.textAlign = 'center';
    g.fillText('click to shuffle', canvas.width / 2, canvas.height - 10);
}

function drawTile(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    g.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    g.strokeStyle = 'black';
    g.strokeRect(dx, dy, tileSize, tileSize);
}

image.onload = function () {
    init();
    drawGrid();
}
