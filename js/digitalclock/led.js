export default class Led {
    constructor(x, y, idx, ox, oy) {
        // starting points in scalable units that will be multiplied by 'size' later
        this.x = x;
        this.y = y;

        // horizontal or vertical layout
        this.idx = idx;

        // pixel values to create small gaps between the leds
        this.offset_x = ox;
        this.offset_y = oy;
    }
}
