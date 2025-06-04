import Vector from './Vector.js';

export default class Segment {
  constructor(private _start: Vector, private _end: Vector) {}

  get start() { return this._start; }
  get end() { return this._end; }

  collidesWith(segment: Segment): Vector | null {
    const { start: a, end: b } = this;
    const { start: c, end: d } = segment;

    const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
    if (denominator === 0) { return null; }

    const t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / denominator;
    const u = -((a.x - b.x) * (a.y - c.y) - (a.y - b.y) * (a.x - c.x)) / denominator;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return new Vector(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y));
    }

    return null;
  }
}
