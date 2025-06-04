"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_js_1 = __importDefault(require("./Vector.js"));
const Util = {
    mousePos: new Vector_js_1.default(0, 0),
    mouseMoved: false,
    getRelativeMousePos(canvas, origin = new Vector_js_1.default(0, 0)) {
        const rect = canvas.getBoundingClientRect();
        return new Vector_js_1.default(Util.mousePos.x - rect.left, Util.mousePos.y - rect.top).subtract(origin);
    },
    // Normalize an angle to the range (-pi, pi]
    normalizeAngle(angle) {
        angle %= Math.PI * 2;
        if (angle < -Math.PI) {
            angle += Math.PI * 2;
        }
        if (angle > Math.PI) {
            angle -= Math.PI * 2;
        }
        return angle;
    },
    isBetweenAngles(angle, start, end) {
        if (start < end) {
            return angle >= start && angle <= end;
        }
        else {
            return angle >= start || angle <= end;
        }
    }
};
addEventListener('mousemove', () => {
    Util.mouseMoved = true;
}, { once: true });
addEventListener('mousemove', (event) => {
    Util.mousePos.x = event.clientX;
    Util.mousePos.y = event.clientY;
});
exports.default = Util;
