const canvas = document.querySelector('canvas');
canvas.width = 832;
canvas.height = 500;

const g = canvas.getContext('2d');

const depthLimit = 7;
const hue = 54;

function drawTree(x1, y1, x2, y2, depth) {

    if (depth === depthLimit)
        return;

    const dx = x2 - x1;
    const dy = y1 - y2;

    const x3 = x2 - dy;
    const y3 = y2 - dx;
    const x4 = x1 - dy;
    const y4 = y1 - dx;
    const x5 = x4 + 0.5 * (dx - dy);
    const y5 = y4 - 0.5 * (dx + dy);

    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.lineTo(x3, y3);
    g.lineTo(x4, y4);
    g.closePath();

    const hue1 = Math.floor(hue + depth * 7.2) % 360;
    g.fillStyle = `hsl(${hue1}, 100%, 50%)`;
    g.fill();
    g.strokeStyle = "lightGray";
    g.stroke();

    g.beginPath();
    g.moveTo(x3, y3);
    g.lineTo(x4, y4);
    g.lineTo(x5, y5);
    g.closePath();

    const hue2 = Math.floor(hue + depth * 12.6) % 360;
    g.fillStyle = `hsl(${hue2}, 100%, 50%)`;
    g.fill();
    g.strokeStyle = "lightGray";
    g.stroke();

    setTimeout(function () {
        drawTree(x4, y4, x5, y5, depth + 1);
        drawTree(x5, y5, x3, y3, depth + 1);
    }, 500);
}

function draw() {
    g.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(357, 500, 487, 500, 0);
}

draw();

setInterval(draw, 10000);
