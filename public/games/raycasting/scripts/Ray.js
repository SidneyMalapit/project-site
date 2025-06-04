import Util from './Util.js';
import Vector from './Vector.js';
import Segment from './Segment.js';
export default class Ray {
    constructor(_origin, _angle) {
        this._origin = _origin;
        this._angle = _angle;
        this.angle = _angle;
    }
    get origin() { return this._origin; }
    get angle() { return this._angle; }
    set origin(origin) { this._origin = origin; }
    set angle(angle) { this._angle = Util.normalizeAngle(angle); }
    collidesWithSegment(segment) {
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
