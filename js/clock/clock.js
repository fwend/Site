const canvas = document.querySelector('canvas');
canvas.width = 500;
canvas.height = 500;

const g = canvas.getContext('2d');

const degrees06 = Math.PI / 30;
const degrees30 = degrees06 * 5;
const degrees90 = degrees30 * 3;

const size = 500;
const spacing = 40;
const diameter = size - 2 * spacing;
const cx = diameter / 2 + spacing;
const cy = cx;


function drawClock() {

    g.clearRect(0, 0, canvas.width, canvas.height);

    drawFace();

    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    let angle = degrees90 - (degrees06 * seconds);
    drawHand(angle, diameter / 2 - 30, "red");

    const minsecs = (minutes + seconds / 60);
    angle = degrees90 - (degrees06 * minsecs);
    drawHand(angle, diameter / 3 + 10, "black");

    const hourmins = (hours + minsecs / 60);
    angle = degrees90 - (degrees30 * hourmins);
    drawHand(angle, diameter / 4 + 10, "black");
}

function drawHand(angle, radius, color) {
    const x = cx + radius * Math.cos(angle);
    const y = cy - radius * Math.sin(angle);
    g.lineWidth = 2
    g.strokeStyle = color;

    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(x, y);
    g.closePath();
    g.stroke();
}

function drawFace() {
    g.beginPath();
    g.lineWidth = 2
    g.strokeStyle = "black";
    g.arc(cx, cy, diameter / 2, 0, 360);
    g.stroke();
}

setInterval(drawClock, 1000);
