'use strict';
const canvas = document.querySelector('canvas');
canvas.width = 800;
canvas.height = 600;

const g = canvas.getContext('2d');

const gravity = 1;
let balls = [];

function Ball(x, y, radius, velocity, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
    this.stopped = false;
}

Ball.prototype.draw = function () {
    g.beginPath();
    g.fillStyle = this.color;
    g.strokeStyle = "black";
    g.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    g.closePath();
    g.fill();
    g.stroke();
}

Ball.prototype.update = function () {
    if (!this.stopped) {

        if (this.y + this.radius + this.velocity > canvas.height) {
            const mass = this.radius / 250;
            this.velocity = -this.velocity * (1.0 - mass);

            if (Math.abs(this.velocity) < 1) {
                this.stopped = true;
            }

        } else {
            this.velocity += gravity;
        }

        this.y += this.velocity;
    }
}

function animate() {
    requestAnimationFrame(animate);
    g.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach(function (ball) {
        ball.update();
        ball.draw();
    });

    // have all balls stopped, then restart
    if (!balls.some(b => !b.stopped)) {
        init();
    }
}

function init() {
    balls = [];
    const dist = canvas.width / 10;
    for (let i = 0; i < 9; i++) {
        const x = i * dist + 75;
        const r = Math.floor(Math.random() * 50 + 20);
        balls.push(new Ball(x, 50, r, 2, "white"));
    }
}

init();
animate();
