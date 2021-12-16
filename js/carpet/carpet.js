'use strict';
const canvas = document.querySelector('canvas');
canvas.width = 533;
canvas.height = 533;

const dim = 513;
const margin = 20;
let limit = dim;

const g = canvas.getContext('2d');
g.fillStyle = "orange";

function drawCarpet(x, y, size) {
    if (size < limit)
        return;

    size = Math.floor(size / 3);

    for (let i = 0; i < 9; i++) {

        if (i === 4) {
            g.fillRect(x + size, y + size, size, size);

        } else {
            drawCarpet(x + (i % 3) * size, y + (Math.floor(i / 3)) * size, size);
        }
    }
}

function draw() {
    g.save();
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.translate(margin, margin);

    drawCarpet(0, 0, dim);

    g.restore();
}

setInterval(function () {
    draw();
    limit /= 3;
    if (limit <= 1)
        limit = dim;
}, 2000);
