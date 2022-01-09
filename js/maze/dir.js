export const N = 1;
export const S = 2;
export const E = 4;
export const W = 8;

export default class Dir {
    constructor(bit, dx, dy, opposite) {
        this.bit = bit;
        this.dx = dx;
        this.dy = dy;
        this.opposite = opposite;
    }

    static dirList() {
        const list = [];
        list.push(new Dir(N, 0, -1, S));
        list.push(new Dir(S, 0, 1, N));
        list.push(new Dir(E, 1, 0, W));
        list.push(new Dir(W, -1, 0, E));
        return list;
    }
}
