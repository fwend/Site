export default class Box {
    constructor(x, y, w, h) {
        this.y = y;
        this.w = w;
        this.h = h;
        this.x = x;

    }

    contains(mx, my) {
        return mx >= this.x && mx <= this.x + this.w && my >= this.y && my <= my + this.h;
    }
}
