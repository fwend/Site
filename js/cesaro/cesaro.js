import {range, sum} from "../_shared/math.js";
import {HSVtoRGB, toRgbString} from "../_shared/hsv_to_rgb.js";

const canvas = document.querySelector('canvas');
canvas.width = 660;
canvas.height = 660;

const g = canvas.getContext('2d');

const scale = 0.44;
// the base angle of the triangular cut-out
const slope = Math.atan(scale / (0.5 - scale));
const angles = [0, -slope, 2 * slope, -slope];

const maxDepth = 6;
const maxIter = calcMaxIter();
const margin = 60;

let iter = 0;
let depthLimit = 0;

function calcMaxIter() {
    return sum(range(0, maxDepth + 2).map(p => Math.pow(4, p)));
}

function drawLine(x1, y1, x2, y2) {
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.closePath();
    g.stroke();
}

function drawCurve(x1, y1, x2, y2, len, angle, depth) {

    if (depth === 0) {
        const hue = (iter++ / maxIter) % 1;
        g.strokeStyle = toRgbString(HSVtoRGB(hue, 1, 1));
        drawLine(Math.round(x1), Math.round(y1), Math.round(x2), Math.round(y2));
    } else {
        len *= scale;
        for (let i = 0; i < 4; i++) {
            angle += angles[i];
            x2 = x1 + Math.cos(angle) * len;
            y2 = y1 - Math.sin(angle) * len;
            drawCurve(x1, y1, x2, y2, len, angle, depth - 1);
            x1 = x2;
            y1 = y2;
        }
    }
}

function drawCurves(size) {
    const x1 = margin;
    const y1 = margin;

    const x2 = size + margin;
    const y2 = margin;

    const x3 = size + margin;
    const y3 = size + margin;

    const x4 = margin;
    const y4 = size + margin;

    drawCurve(x1, y1, x2, y2, size, 0, depthLimit);
    drawCurve(x2, y2, x3, y3, size, -Math.PI / 2, depthLimit);
    drawCurve(x3, y3, x4, y4, size, -Math.PI, depthLimit);
    drawCurve(x4, y4, x1, y1, size, -Math.PI * 1.5, depthLimit);
}

function draw() {
    g.clearRect(0, 0, canvas.width, canvas.height);
    drawCurves(canvas.width - 2 * margin);
}

setInterval(() => {
    depthLimit++;
    if (depthLimit > maxDepth) {
        depthLimit = 0;
    }
    draw();
}, 3000);
