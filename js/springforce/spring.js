import PVector from "../_shared/pvector.js";

const k = 0.1;

export default class Spring {

    constructor(x, y, hw, len) {
        this.halfWidth = hw;
        this.anchor = new PVector(x, y);
        this.restLength = len;
    }
    
    getSpringForce(bob) {
    
        // Vector pointing from anchor to bob location
        const force = PVector.sub(bob.position, this.anchor);
    
        // What is distance
        const dist = force.mag();
    
        // Stretch is difference between current distance and rest length
        const stretch = dist - this.restLength;
    
        // Calculate force according to Hooke'spring Law: F = k * stretch
        force.normalize();
        force.mult(-1 * k * stretch);
    
        return force;
    }
    
    constrainLength(bob, min, max) {
        const force = PVector.sub(bob.position, this.anchor);
        const fm = force.mag();
    
        if (fm < min) {
            force.normalize();
            force.mult(min);
            bob.position = PVector.add(this.anchor, force);
            bob.velocity.mult(0);
        } else if (fm > max) {
            force.normalize();
            force.mult(max);
            bob.position = PVector.add(this.anchor, force);
            bob.velocity.mult(0);
        }
    }
}
