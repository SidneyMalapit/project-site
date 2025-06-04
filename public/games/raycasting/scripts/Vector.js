"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(_x, _y) {
        this._x = _x;
        this._y = _y;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    set x(value) { this._x = value; }
    set y(value) { this._y = value; }
    get magnitude() { return Math.hypot(this.x, this.y); }
    set magnitude(value) {
        const { magnitude } = this;
        this.x *= value / magnitude;
        this.y *= value / magnitude;
    }
    // no normalizing needed, range of atan2 is [-PI, PI]
    get angle() { return Math.atan2(this.y, this.x); }
    set angle(value) {
        const { magnitude } = this;
        this.x = Math.cos(value) * magnitude;
        this.y = Math.sin(value) * magnitude;
    }
    angleTo(v) { return Math.atan2(v.y - this.y, v.x - this.x); }
    clone() { return new Vector(this.x, this.y); }
    add(v) { return new Vector(this.x + v.x, this.y + v.y); }
    negate() { return this.scale(-1); }
    subtract(v) { return this.add(v.negate()); }
    scale(scalar) { return new Vector(this.x * scalar, this.y * scalar); }
    distanceTo(v) { return this.subtract(v).magnitude; }
    static fromAngle(angle) { return new Vector(Math.cos(angle), Math.sin(angle)); }
}
exports.default = Vector;
