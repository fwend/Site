import PVector from "../_shared/pvector.js";
import Box from "./box.js";

export default class Bob {

    constructor(x, y, hw) {
        this.halfWidth = hw;
        this.position = new PVector(x, y);
        this.velocity = new PVector(0, 0);
        this.acceleration = new PVector(0, 0);
        this.mass = 24;

        // Arbitrary damping to simulate friction / drag
        this.damping = 0.98;
        this.dragOffset = new PVector(0, 0);
        this.box = new Box(0, 0, 50, 50);
        this.dragging = false;
    }

    applyForce(force) {
        if (!this.dragging) {
            const f = force.copy();
            f.div(this.mass);
            this.acceleration.add(f);
        }
    }

    update() {
        if (!this.dragging) {
            this.velocity.add(this.acceleration);
            this.velocity.mult(this.damping);
            this.position.add(this.velocity);
            this.acceleration.mult(0);
        }
        this.box.x = Math.floor(this.position.x - this.box.w / 2);
        this.box.y = Math.floor(this.position.y);
    }

    handleDrag(mx, my) {
        if (this.dragging) {
            this.position.x = mx + this.dragOffset.x;
            this.position.y = my + this.dragOffset.y;
        }
    }

    stopDragging() {
        this.dragging = false;
    }

    handleClick(mx, my) {
        if (this.box.contains(mx, my)) {
            this.dragging = true;
            this.dragOffset.x = this.position.x - mx;
            this.dragOffset.y = this.position.y - my;
        }
    }
}
