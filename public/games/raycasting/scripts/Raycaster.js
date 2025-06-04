"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentVisibilility = void 0;
const Util_js_1 = __importDefault(require("./Util.js"));
const Vector_js_1 = __importDefault(require("./Vector.js"));
const Ray_js_1 = __importDefault(require("./Ray.js"));
var SegmentVisibilility;
(function (SegmentVisibilility) {
    SegmentVisibilility[SegmentVisibilility["Invisible"] = 0] = "Invisible";
    SegmentVisibilility[SegmentVisibilility["Visible"] = 1] = "Visible";
    SegmentVisibilility[SegmentVisibilility["PartiallyVisible"] = 2] = "PartiallyVisible";
    SegmentVisibilility[SegmentVisibilility["PartiallyVisibleStart"] = 3] = "PartiallyVisibleStart";
    SegmentVisibilility[SegmentVisibilility["PartiallyVisibleEnd"] = 4] = "PartiallyVisibleEnd";
})(SegmentVisibilility || (exports.SegmentVisibilility = SegmentVisibilility = {}));
class Raycaster {
    constructor(_origin, _angle, fov = Math.PI * 2 / 3) {
        this._origin = _origin;
        this._angle = _angle;
        this.fov = fov;
        this._angle = Util_js_1.default.normalizeAngle(this._angle);
    }
    get leftLimit() { return Util_js_1.default.normalizeAngle(this.angle - this.fov / 2); }
    get rightLimit() { return Util_js_1.default.normalizeAngle(this.angle + this.fov / 2); }
    set origin(origin) {
        this._origin.x = origin.x;
        this._origin.y = origin.y;
    }
    get origin() { return this._origin; }
    set angle(angle) { this._angle = Util_js_1.default.normalizeAngle(angle); }
    get angle() { return this._angle; }
    castToPoint(point) {
        return new Ray_js_1.default(this.origin, this.origin.angleTo(point));
    }
    inViewLimits(point) {
        const angle = this.origin.angleTo(point);
        if (Math.abs(angle - this.leftLimit) < 2 ** -10) {
            return true;
        }
        if (Math.abs(angle - this.rightLimit) < 2 ** -10) {
            return true;
        }
        return Util_js_1.default.isBetweenAngles(angle, this.leftLimit, this.rightLimit);
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
            if (intersection.distanceTo(point) <= 2 ** -10) {
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
            const leftRay = new Ray_js_1.default(origin, this.leftLimit);
            const intersectionLeft = leftRay.collidesWithSegment(segment);
            if (intersectionLeft) {
                if (this.isPointVisible(intersectionLeft, segments)) {
                    segmentVisbility.set(segment, SegmentVisibilility.PartiallyVisible);
                    continue;
                }
            }
            const rightRay = new Ray_js_1.default(origin, this.rightLimit);
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
        this.origin = this.origin.add(Vector_js_1.default.fromAngle(this.angle + relativeDirection).scale(distance));
    }
}
exports.default = Raycaster;
