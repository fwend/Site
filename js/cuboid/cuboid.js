import pointerTracker from "../_shared/tracker.js";

const canvas = document.querySelector('canvas');
canvas.width = 700;
canvas.height = 700;

const g = canvas.getContext('2d');

const nodes = [[-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1],
    [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1]];

const edges = [[0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6],
    [6, 4], [0, 4], [1, 5], [2, 6], [3, 7]];

let mouseX = 0, prevMouseX, mouseY = 0, prevMouseY;
let dragging = false;

pointerTracker(canvas, function (eventType, x, y) {
    switch (eventType) {

        case 'down':
            dragging = true;
            break;

        case 'move':
            if (dragging) {
                prevMouseX = mouseX;
                prevMouseY = mouseY;
                mouseX = x;
                mouseY = y;

                const incrX = (mouseX - prevMouseX) * 0.01;
                const incrY = (mouseY - prevMouseY) * 0.01;

                rotateCuboid(incrX, incrY);
                drawCuboid();
            }
            break;

        case 'up':
            dragging = false;
            break;
    }
});

function scale(factor0, factor1, factor2) {
    nodes.forEach(function (node) {
        node[0] *= factor0;
        node[1] *= factor1;
        node[2] *= factor2;
    });
}

function rotateCuboid(angleX, angleY) {

    const sinX = Math.sin(angleX);
    const cosX = Math.cos(angleX);

    const sinY = Math.sin(angleY);
    const cosY = Math.cos(angleY);

    nodes.forEach(function (node) {
        const x = node[0];
        const y = node[1];
        let z = node[2];

        node[0] = x * cosX - z * sinX;
        node[2] = z * cosX + x * sinX;

        z = node[2];

        node[1] = y * cosY - z * sinY;
        node[2] = z * cosY + y * sinY;
    });
}

function drawCuboid() {
    g.save();

    g.clearRect(0, 0, canvas.width, canvas.height);
    g.translate(canvas.width / 2, canvas.height / 2);
    g.strokeStyle = 'black';
    g.beginPath();

    edges.forEach(function (edge) {
        const p1 = nodes[edge[0]];
        const p2 = nodes[edge[1]];
        g.moveTo(p1[0], p1[1]);
        g.lineTo(p2[0], p2[1]);
    });

    g.closePath();
    g.stroke();

    g.restore();
}

scale(80, 120, 160);
rotateCuboid(Math.PI / 5, Math.PI / 9);

setInterval(function () {
    rotateCuboid(Math.PI / 180, 0);
    drawCuboid();
}, 17);
