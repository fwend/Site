import PVector from "../_shared/pvector.js";

export default class Mover {

    constructor(x, y, w, h, m) {
        this.position = new PVector(x, y);
        this.velocity = new PVector(1, 0);
        this.acceleration = new PVector(0, 0);
        this.mass = m;
        this.w = w;
        this.h = h;
    }

    applyForce(force) {
        this.acceleration.add(PVector.div(force, this.mass));
    }

    checkEdges() {
        if (this.position.x > this.w) {
            this.position.x = this.w;
            this.velocity.x *= -1;

        } else if (this.position.x < 0) {
            this.velocity.x *= -1;
            this.position.x = 0;
        }
        if (this.position.y > this.h) {
            this.velocity.y *= -1;
            this.position.y = this.h;
        }
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
}
