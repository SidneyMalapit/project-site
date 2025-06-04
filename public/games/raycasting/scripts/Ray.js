"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Util_js_1 = __importDefault(require("./Util.js"));
const Vector_js_1 = __importDefault(require("./Vector.js"));
const Segment_js_1 = __importDefault(require("./Segment.js"));
class Ray {
    constructor(_origin, _angle) {
        this._origin = _origin;
        this._angle = _angle;
        this.angle = _angle;
    }
    get origin() { return this._origin; }
    get angle() { return this._angle; }
    set origin(origin) { this._origin = origin; }
    set angle(angle) { this._angle = Util_js_1.default.normalizeAngle(angle); }
    collidesWithSegment(segment) {
        const { origin, angle } = this;
        const { start, end } = segment;
        const d1 = origin.distanceTo(start);
        const d2 = origin.distanceTo(end);
        const maxDistance = Math.max(d1, d2);
        const rayEnd = Vector_js_1.default.fromAngle(angle).scale(maxDistance).add(origin);
        const segmentFromRay = new Segment_js_1.default(origin, rayEnd);
        return segmentFromRay.collidesWith(segment);
    }
}
exports.default = Ray;
