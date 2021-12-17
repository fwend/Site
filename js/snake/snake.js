export const MAX_ENERGY = 1500;
export const WALL = -2;

export default class Snake {

    constructor(x, y) {
        this.body = [
            { x: x, y: y },
            { x: x + 1, y: y },
            { x: x + 2, y: y },
            { x: x + 3, y: y },
            { x: x + 4, y: y }
        ];
        this.energy = MAX_ENERGY;
    }

    resetEnergy() {
        this.energy = MAX_ENERGY;
    }

    energyUsed() {
        this.energy -= 10;
        return this.energy <= 0;
    }

    nextPosition(dir) {
        const head = this.body[0];
        return { x: head.x + dir.x, y: head.y + dir.y };
    }

    hitsWall(grid, dir) {
        const pos = this.nextPosition(dir);
        return grid[pos.y][pos.x] === WALL;
    }

    hitsSelf(dir) {
        const pos = this.nextPosition(dir);
        return this.body.some(function (p) {
            return (p.x === pos.x && p.y === pos.y)
        });
    }

    eat(treats, dir) {
        const pos = this.nextPosition(dir);
        return treats.some(function (t, i) {
            if (t.x === pos.x && t.y === pos.y) {
                treats.splice(i, 1);
                return true;
            }
            return false;
        });
    }

    grow(dir) {
        const tail = this.body[this.body.length - 1];
        const x = tail.x + dir.x;
        const y = tail.y + dir.y;
        this.body.push({ x: x, y: y });
    }

    move(dir) {
        for (let i = this.body.length - 1; i > 0; i--) {
            const p1 = this.body[i - 1];
            const p2 = this.body[i];
            p2.x = p1.x;
            p2.y = p1.y;
        }
        const head = this.body[0];
        head.x += dir.x;
        head.y += dir.y;
    }
}
