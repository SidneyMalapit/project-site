export default class Vector {
  constructor(private _x: number, private _y: number) {}

  get x() { return this._x; }
  get y() { return this._y; }
  set x(value: number) { this._x = value; }
  set y(value: number) { this._y = value; }

  get magnitude() { return Math.hypot(this.x, this.y); }
  set magnitude(value: number) {
    const { magnitude } = this;
    this.x *= value / magnitude;
    this.y *= value / magnitude;
  }

  // no normalizing needed, range of atan2 is [-PI, PI]
  get angle() { return Math.atan2(this.y, this.x); }
  set angle(value: number) {
    const { magnitude } = this;
    this.x = Math.cos(value) * magnitude;
    this.y = Math.sin(value) * magnitude;
  }

  angleTo(v: Vector) { return Math.atan2(v.y - this.y, v.x - this.x); }

  clone() { return new Vector(this.x, this.y); }

  add(v: Vector) { return new Vector(this.x + v.x, this.y + v.y); }
  negate() { return this.scale(-1); }
  subtract(v: Vector) { return this.add(v.negate()); }
  scale(scalar: number) { return new Vector(this.x * scalar, this.y * scalar); }
  distanceTo(v: Vector) { return this.subtract(v).magnitude; }

  static fromAngle(angle: number) { return new Vector(Math.cos(angle), Math.sin(angle)); }
}
