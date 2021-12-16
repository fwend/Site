import {HSVtoRGB} from "../shared/hsv_to_rgb.js";

'use strict';
const canvas = document.querySelector('canvas');
canvas.width = 800;
canvas.height = 800;

const g = canvas.getContext('2d');

const maxIter = 300;
const zoom = 1;
let cY, cX;

function drawJuliaSet() {
    const w = canvas.width;
    const h = canvas.height;

    const img = g.getImageData(0, 0, w, h);

    cX = -0.7;
    cY = 0.27015;
    let moveX = 0, moveY = 0;
    let zx, zy;

    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            zx = 1.5 * (x - Math.floor(w / 2)) / (0.5 * zoom * w) + moveX;
            zy = (y - Math.floor(h / 2)) / (0.5 * zoom * h) + moveY;
            let i = maxIter;
            while (zx * zx + zy * zy < 4 && i > 0) {
                const tmp = zx * zx - zy * zy + cX;
                zy = 2.0 * zx * zy + cY;
                zx = tmp;
                i--;
            }
            const rgb = HSVtoRGB((maxIter / i) % 1, 1, i > 0 ? 1 : 0);
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
    drawJuliaSet();
}

draw();
