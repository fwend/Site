import PVector from "../_shared/pvector.js";

export default class Attractor {

    constructor(x, y, w, h, m, g) {
        this.position = new PVector(x, y);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.G = g;
        this.mass = m;
    }

    constrain(val, min, max) {
        if (val < min) {
            return min;
        } else if (val > max) {
            return max;
        }
        return val;
    }

    calculateAttraction(mover) {
        const force = PVector.sub(this.position, mover.position);
        const distance = this.constrain(force.mag(), 10, 25);
        force.normalize();

        const strength = (this.G * this.mass * mover.mass) / (distance * distance);
        force.mult(strength);

        return force;
    }
}
