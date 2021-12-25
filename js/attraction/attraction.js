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
const color1 = '#' + (Number(randomInt(0x707070) + 0x707070).toString(16)).padStart(8, '0');
const color2 = brighter(color1, 20);

function initMovers(num) {
    const result = Array(num);
    for (let i = 0; i < num; i++) {
        const mass = Math.random() * 1.4 + 0.8;
        result[i] = new Mover(randomOffCenter(w), randomOffCenter(h), 0, 0, mass);
    }
    return result;
}

function drawAttractor() {
    const size = Math.floor(attractor.mass);
    const half = size / 2;
    g.beginPath();
    g.arc(Math.floor(w / 2) - half, Math.floor(h / 2) - half, size, 0, 2 * Math.PI, false);
    g.fillStyle = 'white';
    g.fill();
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
    const gradient = g.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    g.fillStyle = gradient;
    g.fillRect(0, 0, w, h);

    drawAttractor();
    for (let mover of movers) {
        const pull = attractor.calculateAttraction(mover);
        mover.applyForce(pull);
        mover.update();
        drawMover(mover);
    }
}

function randomOffCenter(len) {
    const center = Math.floor(len / 2) - 50;
    let pos;
    do {
        pos = randomInt(len - 100, 50);
    } while (pos > center && pos < center + 100);
    return pos;
}

function brighter(hexString, percent) {

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = hexString;
    ctx.fillRect(0, 0, 1, 1);

    const color = ctx.getImageData(0, 0, 1, 1);
    const r = color.data[0] + Math.floor(percent / 100 * 255);
    const g = color.data[1] + Math.floor(percent / 100 * 255);
    const b = color.data[2] + Math.floor(percent / 100 * 255);

    return 'rgb(' + r + ',' + g + ',' + b + ')';
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
