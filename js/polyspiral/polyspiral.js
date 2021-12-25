import {HSVtoRGB, toRgbString} from "../_shared/color.js";

const canvas = document.querySelector("canvas");
canvas.width = 700;
canvas.height = 700;

const g = canvas.getContext("2d");

let inc = 0;

function drawSpiral(len, angleIncrement) {
    let x1 = canvas.width / 2;
    let y1 = canvas.height / 2;
    let angle = angleIncrement;

    for (let i = 0; i < 150; i++) {

        const x2 = x1 + Math.cos(angle) * len;
        const y2 = y1 - Math.sin(angle) * len;

        g.strokeStyle = toRgbString(HSVtoRGB(i / 150, 1.0, 1.0));
        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();

        x1 = x2;
        y1 = y2;

        len += 3;

        angle = (angle + angleIncrement) % (Math.PI * 2);
    }
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

setInterval(function () {
    inc = (inc + 0.05) % 360;
    g.clearRect(0, 0, canvas.width, canvas.height);
    drawSpiral(5, toRadians(inc));
}, 40);
