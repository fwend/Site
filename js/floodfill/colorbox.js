export default class Colorbox {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.selected = false;
    }

    withinBounds(mx, my) {
        return mx >= this.x && mx <= this.x + this.w &&
            my >= this.y && my <= this.y + this.h;
    }
}
