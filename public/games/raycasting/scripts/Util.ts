import Vector from './Vector.js';

const Util = {
  mousePos: new Vector(0, 0),
  mouseMoved: false,

  getRelativeMousePos(canvas: HTMLCanvasElement, origin = new Vector(0, 0)) {
    const rect = canvas.getBoundingClientRect();
    return new Vector(
      Util.mousePos.x - rect.left,
      Util.mousePos.y - rect.top
    ).subtract(origin);
  },

  // Normalize an angle to the range (-pi, pi]
  normalizeAngle(angle: number) {
    angle %= Math.PI * 2;
    if (angle < -Math.PI) { angle += Math.PI * 2; }
    if (angle > Math.PI) { angle -= Math.PI * 2; }
    return angle;
  },

  isBetweenAngles(angle: number, start: number, end: number) {
    if (start < end) {
      return angle >= start && angle <= end;
    } else {
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

export default Util;
