import PVector from "../_shared/pvector.js";
import Attractor from "./attractor.js";
import Mover from "./mover.js";
import {randomInt} from "../_shared/math.js";

const canvas = document.querySelector('canvas');
canvas.width = 640;
canvas.height = 640;

const g = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;
const movers = initMovers(10);
const attractor = new Attractor(w / 2, h / 2, 0, 0, 20, 1);
// const bgColor;
// const bgColorBrighter;

function initMovers(num) {
    const result = Array(num);
    for (let i = 0; i < num; i++) {
        const mass = Math.random() * 1.4 + 0.8;
        result[i] = new Mover(randomInt(w), randomInt(h), 0, 0, mass); // TODO
    }
    return result;
}

function drawAttractor() {
    const size = Math.floor(attractor.mass);
    g.beginPath();
    g.fillStyle = 'white';
    g.arc(Math.floor(w / 2), Math.floor(h / 2) - size / 2, size, 0, 2 * Math.PI, false);
    g.lineWidth = 2;
    g.strokeStyle = 'black';
    g.stroke();
}

function drawMover(mover) {
    const size = Math.floor(mover.mass * 8);
    g.beginPath();
    g.arc(mover.position.x, mover.position.y - size / 2, size, 0, 2 * Math.PI, false);
    g.fillStyle = '#FFFFFF7F';
    g.fill();
    g.lineWidth = 1;
    g.strokeStyle = 'black';
    g.stroke();
}

function draw() {
    g.clearRect(0, 0, w, h);
    drawAttractor();
    for (let mover of movers) {
        const pull = attractor.calculateAttraction(mover);
        mover.applyForce(pull);
        mover.update();
        drawMover(mover);
    }
}


function animate(lastFrameTime) {
    const time = new Date().getTime();
    const delay = 16;

    if (lastFrameTime + delay < time) {
        draw();
        lastFrameTime = time;
    }

    requestAnimationFrame(function () {
        animate(lastFrameTime);
    });
}

animate(0);
