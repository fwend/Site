const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const g = canvas.getContext("2d");
g.fillStyle = "#6AA84F";

const fern = [];
const limit = 400000;
let pixelCount = 0;

function createFern(leftMargin, topMargin, w, h) {
    let x = 0, y = 0;

    for (let i = 0; i < limit; i++) {
        let tmpx, tmpy;
        let r = Math.random();

        if (r <= 0.01) {
            tmpx = 0;
            tmpy = 0.16 * y;
        } else if (r <= 0.08) {
            tmpx = 0.2 * x - 0.26 * y;
            tmpy = 0.23 * x + 0.22 * y + 1.6;
        } else if (r <= 0.15) {
            tmpx = -0.15 * x + 0.28 * y;
            tmpy = 0.26 * x + 0.24 * y + 0.44;
        } else {
            tmpx = 0.85 * x + 0.04 * y;
            tmpy = -0.04 * x + 0.85 * y + 1.6;
        }
        x = tmpx;
        y = tmpy;

        fern[i] = [
            Math.round(leftMargin + w / 2 + x * w / 11),
            Math.round(topMargin + h - y * h / 11)
        ];
    }
}

function animate() {
    let requestID = requestAnimationFrame(animate);

    if (pixelCount < limit) {
        for (let i = pixelCount; i < 500 + pixelCount; i++) {
            g.fillRect(fern[i][0], fern[i][1], 1, 1);
        }
        pixelCount += 500;
    } else {
        cancelAnimationFrame(requestID);
    }
}

createFern((canvas.width - 600) / 2, (canvas.height - 600) / 2, 600, 600);
animate();
