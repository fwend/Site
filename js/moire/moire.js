const canvas = document.querySelector('canvas');
canvas.width = 900;
canvas.height = 600;

const g = canvas.getContext('2d');

let counter = 0;
let increasing = true;
const x = 450, y = 300, width = 500;

function draw() {
    g.clearRect(0, 0, canvas.width, canvas.height);

    if (increasing) {
        counter++;
        if (counter > 120) {
            increasing = false;
        }
    } else {
        counter--;
        if (counter === 1) {
            increasing = true;
        }
    }

    g.strokeStyle = "red";
    for (let i = 10; i < width; i += 10) {
        g.beginPath();
        g.arc(x - counter, y, Math.round(i / 2), 0, Math.PI * 2, false);
        g.closePath();
        g.stroke();
    }

    g.strokeStyle = "blue";
    for (let i = 10; i < width; i += 10) {
        g.beginPath();
        g.arc(x + counter, y, Math.round(i / 2), 0, Math.PI * 2, false);
        g.closePath();
        g.stroke();
    }
}

setInterval(() => draw(), 100);
