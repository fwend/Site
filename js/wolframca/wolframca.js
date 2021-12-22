import {createMatrix} from "../_shared/matrix.js";

const canvas = document.querySelector('canvas');
canvas.width = 700;
canvas.height = 350;

const g = canvas.getContext('2d');

g.font = '24px sans-serif';

const ruleSet = [30, 45, 50, 57, 62, 70, 73, 75, 86, 89, 90, 99,
    101, 105, 109, 110, 124, 129, 133, 135, 137, 139, 141];
const cells = createMatrix(canvas.height, canvas.width);
let rule = 0;

cells[0][Math.floor(canvas.width/ 2)] = 1; // starting point

function applyRules(lhs, mid, rhs) {
    const idx = (lhs << 2 | mid << 1 | rhs); // 8 possible neighborhoods
    return (ruleSet[rule] >> idx & 1); // rule termines what each neighborhood translates to
}

function drawCA() {
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.fillStyle = 'black';
    for (let r = 0; r < cells.length - 1; r++) {
        for (let c = 1; c < cells[r].length - 1; c++) {
            const lhs = cells[r][c - 1];
            const mid = cells[r][c];
            const rhs = cells[r][c + 1];
            cells[r + 1][c] = applyRules(lhs, mid, rhs); // next generation
            if (cells[r][c] === 1) {
                g.fillRect(c, r, 1, 1);
            }
        }
    }
}

function drawLegend() {
    g.fillStyle = 'white';
    g.fillRect(15, 5, 55, 30);

    g.fillStyle = 'black';
    g.textAlign = 'center';
    g.fillText(String(ruleSet[rule]), 42.5, 28);
}

function draw() {
    drawCA();
    drawLegend();
}

draw();

setInterval(() => {
    rule++;
    if (rule === ruleSet.length) {
        rule = 0;
    }
    draw();
}, 5000);
