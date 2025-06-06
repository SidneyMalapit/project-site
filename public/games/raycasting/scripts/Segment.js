"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_js_1 = __importDefault(require("./Vector.js"));
class Segment {
    constructor(_start, _end) {
        this._start = _start;
        this._end = _end;
    }
    get start() { return this._start; }
    get end() { return this._end; }
    collidesWith(segment) {
        const { start: a, end: b } = this;
        const { start: c, end: d } = segment;
        const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
        if (denominator === 0) {
            return null;
        }
        const t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / denominator;
        const u = -((a.x - b.x) * (a.y - c.y) - (a.y - b.y) * (a.x - c.x)) / denominator;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return new Vector_js_1.default(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y));
        }
        return null;
    }
}
exports.default = Segment;
