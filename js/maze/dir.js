export const N = 1;
export const S = 2;
export const E = 4;
export const W = 8;

export default class Dir {
    constructor(direction, dx, dy, opposite) {
        this.direction = direction;
        this.dx = dx;
        this.dy = dy;
        this.opposite = opposite;
    }

    static dirList() {
        /* prefer south and east for the solving algorithm */
        const list = [];
        list.push(Object.freeze(new Dir(S, 0, 1, N)));
        list.push(Object.freeze(new Dir(E, 1, 0, W)));
        list.push(Object.freeze(new Dir(N, 0, -1, S)));
        list.push(Object.freeze(new Dir(W, -1, 0, E)));
        return list;
    }
}
