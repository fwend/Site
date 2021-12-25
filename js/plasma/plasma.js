import {HSVtoRGB} from "../_shared/color.js";

const canvas = document.querySelector('canvas');
canvas.width = 700;
canvas.height = 500;

const g = canvas.getContext('2d');

const plasma = createPlasma(canvas.width, canvas.height);
let hueShift = 0;

function createPlasma(w, h) {
    const buffer = new Array(h);

    for (let y = 0; y < h; y++) {
        buffer[y] = new Array(w);

        for (let x = 0; x < w; x++) {

            let value = Math.sin(x / 16.0);
            value += Math.sin(y / 8.0);
            value += Math.sin((x + y) / 16.0);
            value += Math.sin(Math.sqrt(x * x + y * y) / 8.0);
            value += 4; // shift math from -4 .. 4 to 0 .. 8
            value /= 8; // bring math down to 0 .. 1

            buffer[y][x] = value;
        }
    }
    return buffer;
}

function drawPlasma(w, h) {
    const img = g.getImageData(0, 0, w, h);

    for (let y = 0; y < h; y++) {

        for (let x = 0; x < w; x++) {

            const hue = hueShift + plasma[y][x] % 1;
            const rgb = HSVtoRGB(hue, 1, 1);
            const pos = (y * w + x) * 4;
            img.data[pos] = rgb.r;
            img.data[pos + 1] = rgb.g;
            img.data[pos + 2] = rgb.b;
        }
    }
    g.putImageData(img, 0, 0);
}

function animate(lastFrameTime) {
    const time = new Date().getTime();
    const delay = 42;

    if (lastFrameTime + delay < time) {
        hueShift = (hueShift + 0.02) % 1;
        drawPlasma(canvas.width, canvas.height);
        lastFrameTime = time;
    }

    requestAnimationFrame(function () {
        animate(lastFrameTime);
    });
}

g.fillRect(0, 0, canvas.width, canvas.height);
animate(0);
