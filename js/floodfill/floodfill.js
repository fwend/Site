import Colorbox from "./colorbox.js";

const canvas = document.querySelector('canvas');
canvas.width = 700;
canvas.height = 700;

const g = canvas.getContext('2d');

const fillAreaWidth = 700; // TODO scaling
const fillAreaHeight = 630; // TODO scaling
const colorboxes = createColorMenu();
let selectedColor = 0xff00ffff; //rgba

canvas.addEventListener('mousedown', function (event) {
    const rect = canvas.getBoundingClientRect();
    const ex = Math.floor(event.clientX - rect.left);
    const ey = Math.floor(event.clientY - rect.top);
    if (ex >= 0 && ey >= 0 && ex < fillAreaWidth && ey < fillAreaHeight) {
        floodFill(ex, ey, selectedColor)
    } else {

        for (const box of colorboxes) {
            box.selected = false;
            if (box.withinBounds(ex, ey)) {
                selectedColor = box.color;
                box.selected = true;
            }
        }
        drawColorMenu()
    }
});

function floodFill(mx, my, newColor) {
    const img = g.getImageData(0, 0, fillAreaWidth, fillAreaHeight);

    const oldColor = getPixel(img.data, mx, my);
    if (!oldColor || oldColor === newColor || oldColor === 0x000000ff) {
        console.log("return")
        return;
    }

    const stack = [mx, my];
    while (stack.length > 0) {
        const y = stack.pop();
        const x = stack.pop();
        if (getPixel(img.data, x, y) === oldColor) {
            const pos = (y * img.width + x) * 4;
            img.data[pos] = (newColor >> 24) & 0xff;
            img.data[pos + 1] = (newColor >> 16) & 0xff;
            img.data[pos + 2] = (newColor >> 8) & 0xff;
            img.data[pos + 3] = newColor & 0xff;
            stack.push(x + 1, y);
            stack.push(x - 1, y);
            stack.push(x, y + 1);
            stack.push(x, y - 1);
        }
    }
    g.putImageData(img, 0, 0);
}

function getPixel(data, x, y) {
    const i = (y * fillAreaWidth + x) * 4;
    return ((data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3]) >>> 0;
}

function createCanvas() {
    g.fillStyle = 'white';
    g.fillRect(0, 0, fillAreaWidth, fillAreaHeight);
    g.fillStyle = 'black';
    g.strokeRect(0, 0, fillAreaWidth, fillAreaHeight);

    const numLines = 5;
    const columnWidth = fillAreaWidth / numLines;
    const rowHeight = fillAreaHeight / numLines;
    const widthHistory = [0, fillAreaWidth], heightHistory = [0, fillAreaHeight];
    let columnStart = 0, rowStart = 0;

    for (let i = 0; i < numLines; i++) {
        const w = randomPosition(columnStart, columnWidth, widthHistory);
        const h = randomPosition(rowStart, rowHeight, heightHistory);
        drawLine(0, h, fillAreaWidth, h);
        drawLine(w, 0, w, fillAreaHeight);
        columnStart += columnWidth;
        rowStart += rowHeight;
    }
}

function randomPosition(offset, range, history) {
    let val;
    do {
        val = Math.floor(Math.random() * range) + offset;
    } while (history.some((v) => Math.abs(v - val) < 20));

    history.push(val);
    return val;
}

function drawLine(x1, y1, x2, y2, width = 5, color = 'black') {
    g.lineWidth = width;
    g.strokeStyle = color;
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.closePath();
    g.stroke();
}

function drawColorMenu() {
    g.clearRect(0, fillAreaHeight, canvas.width, 70); // TODO scaling
    g.lineWidth = 1;
    for (const box of colorboxes) {
        if (box.selected) {
            g.fillStyle = 'black';
            g.fillRect(box.x - 2, box.y - 2, box.w + 4, box.h + 4);
        }
        g.fillStyle = '#' + (Number(box.color).toString(16)).padStart(8, '0');
        g.fillRect(box.x, box.y, box.w, box.h);
        g.strokeStyle = 'black';
        g.strokeRect(box.x, box.y, box.w, box.h);
    }
}

function createColorMenu() {
    const colorboxes = [];
    const colors = [
        0xff0000ff, 0x0000ffff, 0x008000ff, 0xff5733ff, 0xffff00ff, 0xff00ffff, 0x800080ff, 0x800000ff,
        0x9fe2bfff, 0x00ffffff, 0xffff0fff, 0x808080ff, 0xc0c0c0ff, 0x00ff00ff, 0xffffffff, 0xccccffff
    ];
    for (let i = 0; i < colors.length; i++) {
        const x = 30 + i * 40; // TODO scaling
        const y = fillAreaHeight + 25;
        colorboxes.push(new Colorbox(x, y, 30, 30, colors[i]))

    }
    return colorboxes;
}

function setup() {
    g.clearRect(0, 0, canvas.width, canvas.height);
    createCanvas();
    drawColorMenu();
}

setup();
