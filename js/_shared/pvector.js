export default class PVector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    add(pvector) {
        this.x += pvector.x;
        this.y += pvector.y;
    }

    sub(pvector) {
        this.x -= pvector.x;
        this.y -= pvector.y;
    }

    div(pvector) {
        this.x /= pvector.x;
        this.y /= pvector.y;
    }

    mult(val) {
        this.x *= val;
        this.y *= val;
    }

    mag() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalize() {
        const mag = this.mag();
        if (mag !== 0) {
            this.x /= mag;
            this.y /= mag;
        }
    }

    copy() {
        return new PVector(this.x, this.y);
    }

    static sub(pvector1, pvector2) {
        return new PVector(pvector1.x - pvector2.x, pvector1.y - pvector2.y);
    }

    static div(pvector, val) {
        return new PVector(pvector.x / val, pvector.y / val);
    }
}
