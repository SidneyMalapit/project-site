import Util from './Util.js';
import Vector from './Vector.js';
import Segment from './Segment.js';

export default class Ray {
  constructor(private _origin: Vector, private _angle: number) {
    this.angle = _angle;
  }

  get origin(): Vector { return this._origin; }
  get angle(): number { return this._angle; }
  set origin(origin: Vector) { this._origin = origin; }
  set angle(angle: number) { this._angle = Util.normalizeAngle(angle); }

  collidesWithSegment(segment: Segment): Vector | null {
    const { origin, angle } = this;
    const { start, end } = segment;

    const d1 = origin.distanceTo(start);
    const d2 = origin.distanceTo(end);

    const maxDistance = Math.max(d1, d2);
    const rayEnd = Vector.fromAngle(angle).scale(maxDistance).add(origin);
    const segmentFromRay = new Segment(origin, rayEnd);

    return segmentFromRay.collidesWith(segment);
  }
}
