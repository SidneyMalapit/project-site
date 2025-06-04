import Util from './Util.js';
import Vector from './Vector.js';
import Ray from './Ray.js';
export var SegmentVisibilility;
(function (SegmentVisibilility) {
    SegmentVisibilility[SegmentVisibilility["Invisible"] = 0] = "Invisible";
    SegmentVisibilility[SegmentVisibilility["Visible"] = 1] = "Visible";
    SegmentVisibilility[SegmentVisibilility["PartiallyVisible"] = 2] = "PartiallyVisible";
    SegmentVisibilility[SegmentVisibilility["PartiallyVisibleStart"] = 3] = "PartiallyVisibleStart";
    SegmentVisibilility[SegmentVisibilility["PartiallyVisibleEnd"] = 4] = "PartiallyVisibleEnd";
})(SegmentVisibilility || (SegmentVisibilility = {}));
export default class Raycaster {
    constructor(_origin, _angle, fov = Math.PI * 2 / 3) {
        this._origin = _origin;
        this._angle = _angle;
        this.fov = fov;
        this._angle = Util.normalizeAngle(this._angle);
    }
    get leftLimit() { return Util.normalizeAngle(this.angle - this.fov / 2); }
    get rightLimit() { return Util.normalizeAngle(this.angle + this.fov / 2); }
    set origin(origin) {
        this._origin.x = origin.x;
        this._origin.y = origin.y;
    }
    get origin() { return this._origin; }
    set angle(angle) { this._angle = Util.normalizeAngle(angle); }
    get angle() { return this._angle; }
    castToPoint(point) {
        return new Ray(this.origin, this.origin.angleTo(point));
    }
    inViewLimits(point) {
        const angle = this.origin.angleTo(point);
        if (Math.abs(angle - this.leftLimit) < Math.pow(2, -10)) {
            return true;
        }
        if (Math.abs(angle - this.rightLimit) < Math.pow(2, -10)) {
            return true;
        }
        return Util.isBetweenAngles(angle, this.leftLimit, this.rightLimit);
    }
    isPointVisible(point, segments) {
        const { origin } = this;
        const ray = this.castToPoint(point);
        const intersections = [];
        for (const segment of segments) {
            const intersection = ray.collidesWithSegment(segment);
            if (!intersection) {
                continue;
            }
            if (origin.distanceTo(intersection) > origin.distanceTo(point)) {
                continue;
            }
            if (intersection.distanceTo(point) <= Math.pow(2, -10)) {
                continue;
            }
            intersections.push(intersection);
        }
        return intersections.length === 0 && this.inViewLimits(point);
    }
    getVisibleSegments(segments) {
        const { origin } = this;
        const segmentVisbility = new Map();
        for (const segment of segments) {
            segmentVisbility.set(segment, SegmentVisibilility.Invisible);
            const { start, end } = segment;
            if (!this.inViewLimits(start) && !this.inViewLimits(end)) {
                continue;
            }
            const isStartVisible = this.isPointVisible(start, segments);
            const isEndVisible = this.isPointVisible(end, segments);
            if (isStartVisible && isEndVisible) {
                segmentVisbility.set(segment, SegmentVisibilility.Visible);
            }
            else if (isStartVisible) {
                segmentVisbility.set(segment, SegmentVisibilility.PartiallyVisibleStart);
            }
            else if (isEndVisible) {
                segmentVisbility.set(segment, SegmentVisibilility.PartiallyVisibleEnd);
            }
            const leftRay = new Ray(origin, this.leftLimit);
            const intersectionLeft = leftRay.collidesWithSegment(segment);
            if (intersectionLeft) {
                if (this.isPointVisible(intersectionLeft, segments)) {
                    segmentVisbility.set(segment, SegmentVisibilility.PartiallyVisible);
                    continue;
                }
            }
            const rightRay = new Ray(origin, this.rightLimit);
            const intersectionRight = rightRay.collidesWithSegment(segment);
            if (intersectionRight) {
                if (this.isPointVisible(intersectionRight, segments)) {
                    segmentVisbility.set(segment, SegmentVisibilility.PartiallyVisible);
                    continue;
                }
            }
        }
        return segmentVisbility;
    }
    move(relativeDirection, distance) {
        this.origin = this.origin.add(Vector.fromAngle(this.angle + relativeDirection).scale(distance));
    }
}
