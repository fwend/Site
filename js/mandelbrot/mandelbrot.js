import {HSVtoRGB} from "../_shared/hsv_to_rgb.js";

'use strict';
const canvas = document.querySelector('canvas');
canvas.width = 600;
canvas.height = 600;

const g = canvas.getContext('2d');

const maxIter = 300;
const zoom = 1;

function drawMandelbrotSet() {
    const w = canvas.width;
    const h = canvas.height;

    const img = g.getImageData(0, 0, w, h);

    const moveX = -0.5;
    const moveY = 0;
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let zx = 0, zy = 0;
            const cX = (x - w / 2) / (0.5 * zoom * w) + moveX;
            const cY = (y - h / 2) / (0.5 * zoom * h) + moveY;
            let i = maxIter;
            while (zx * zx + zy * zy < 4 && i > 0) {
                const tmp = zx * zx - zy * zy + cX;
                zy = 2.0 * zx * zy + cY;
                zx = tmp;
                i--;
            }
            const rgb = HSVtoRGB(i / maxIter, 1, i > 0 ? 1 : 0);
            const pos = (y * w + x) * 4;
            img.data[pos] = rgb.r;
            img.data[pos + 1] = rgb.g;
            img.data[pos + 2] = rgb.b;
        }
    }
    g.putImageData(img, 0, 0);
}

function draw() {
    g.fillRect(0, 0, canvas.width, canvas.height);
    drawMandelbrotSet();
}

draw();
