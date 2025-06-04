import Util from './Util.js';
import Vector from './Vector.js';
import Segment from './Segment.js';
import Ray from './Ray.js';
import Raycaster, { SegmentVisibilility } from './Raycaster.js';
const isPressed = {};
document.addEventListener('keydown', (e) => {
    isPressed[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    isPressed[e.key] = false;
});
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const endpoints = [
        new Vector(-100, -100),
        new Vector(100, -100),
        new Vector(-200, 0),
        new Vector(0, -200),
        new Vector(200, 0)
    ];
    const walls = [
        new Segment(endpoints[0], endpoints[1]),
        new Segment(endpoints[2], endpoints[3]),
        new Segment(endpoints[3], endpoints[4]),
    ];
    const raycaster = new Raycaster(new Vector(0, 0), 0);
    setup(canvas, ctx);
    const render = createRenderers(ctx);
    let mousePos = null;
    let prevMousePos = null;
    // update + render
    setInterval(() => {
        mousePos = Util.getRelativeMousePos(canvas, new Vector(canvas.width / 2, canvas.height / 2));
        drawBackground(canvas, ctx);
        if (mousePos && prevMousePos) {
            raycaster.angle += mousePos.subtract(prevMousePos).x / 100;
        }
        if (countMoveKeysPressed() > 0) {
            let direction = new Vector(0, 0);
            if (isPressed['w']) {
                direction.x += 1;
            }
            if (isPressed['a']) {
                direction.y -= 1;
            }
            if (isPressed['s']) {
                direction.x -= 1;
            }
            if (isPressed['d']) {
                direction.y += 1;
            }
            if (direction.magnitude > 1) {
                direction.magnitude = 1;
            }
            raycaster.move(direction.angle, 5 * direction.magnitude);
        }
        ctx.fillStyle = 'red';
        render.vector(mousePos);
        resetSettings(ctx);
        const segmentVisibilityMap = raycaster.getVisibleSegments(walls);
        walls.forEach((wall) => {
            let color;
            const wallVisibility = segmentVisibilityMap.get(wall);
            switch (wallVisibility) {
                case SegmentVisibilility.Invisible:
                    color = 'black';
                    break;
                case SegmentVisibilility.Visible:
                    color = 'yellow';
                    break;
                case SegmentVisibilility.PartiallyVisible:
                case SegmentVisibilility.PartiallyVisibleStart:
                case SegmentVisibilility.PartiallyVisibleEnd:
                    color = 'magenta';
                    break;
            }
            ctx.strokeStyle = color;
            render.segment(wall);
            resetSettings(ctx);
        });
        endpoints.forEach((vector) => {
            ctx.fillStyle = raycaster.isPointVisible(vector, walls) ? 'salmon' : 'lightblue';
            render.vector(vector);
            resetSettings(ctx);
        });
        // render raycaster fov limits as rays
        const leftRay = new Ray(raycaster.origin, raycaster.leftLimit);
        const rightRay = new Ray(raycaster.origin, raycaster.rightLimit);
        ctx.strokeStyle = 'magenta';
        render.ray(leftRay);
        render.ray(rightRay);
        resetSettings(ctx);
        render.raycaster(raycaster);
        // renders past this statement are for 3d projection
        //ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        prevMousePos = mousePos;
    }, 1000 / 60);
});
function setup(canvas, ctx) {
    canvas.width = 400;
    canvas.height = 400;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    resetSettings(ctx);
}
function resetSettings(ctx) {
    ctx.fillStyle = '#f0f0f0';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
}
function createRenderers(ctx) {
    return {
        vector(vector) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(vector.x, vector.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        },
        segment(segment) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(segment.start.x, segment.start.y);
            ctx.lineTo(segment.end.x, segment.end.y);
            ctx.stroke();
            ctx.restore();
        },
        ray(ray) {
            const { origin, angle } = ray;
            const end = origin.add(Vector.fromAngle(angle).scale(1e5));
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(origin.x, origin.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            ctx.restore();
        },
        raycaster(caster) {
            const { origin, angle } = caster;
            const end = origin.add(Vector.fromAngle(angle).scale(1e5));
            const radius = 15;
            ctx.save();
            ctx.beginPath();
            ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
            ctx.moveTo(origin.x, origin.y);
            ctx.lineTo(2 * radius * Math.cos(angle) + origin.x, 2 * radius * Math.sin(angle) + origin.y);
            ctx.stroke();
            ctx.restore();
        }
    };
}
function drawBackground(canvas, ctx) {
    // draw background w/ grid
    ctx.save();
    ctx.resetTransform();
    ctx.fillStyle = '#f0f0f0';
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    ctx.restore();
}
function countMoveKeysPressed() {
    return Object.keys(isPressed).filter((key) => isPressed[key] && 'wasd'.includes(key)).length;
}
