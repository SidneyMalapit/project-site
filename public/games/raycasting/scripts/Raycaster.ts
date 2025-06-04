import Util from './Util.js';
import Vector from './Vector.js';
import Segment from './Segment.js';
import Ray from './Ray.js';

export enum SegmentVisibilility {
  Invisible,
  Visible,
  PartiallyVisible,
  PartiallyVisibleStart,
  PartiallyVisibleEnd
}

export default class Raycaster {
  constructor(private _origin: Vector, private _angle: number, public fov = Math.PI * 2 / 3) {
    this._angle = Util.normalizeAngle(this._angle);
  }

  get leftLimit() { return Util.normalizeAngle(this.angle - this.fov / 2); }
  get rightLimit() { return Util.normalizeAngle(this.angle + this.fov / 2); }

  set origin(origin: Vector) {
    this._origin.x = origin.x;
    this._origin.y = origin.y;
  }
  get origin() { return this._origin; }
  set angle(angle: number) { this._angle = Util.normalizeAngle(angle); }
  get angle() { return this._angle; }

  private castToPoint(point: Vector) {
    return new Ray(this.origin, this.origin.angleTo(point));
  }

  private inViewLimits(point: Vector) {
    const angle = this.origin.angleTo(point);
    if (Math.abs(angle - this.leftLimit) < 2 ** -10) { return true; }
    if (Math.abs(angle - this.rightLimit) < 2 ** -10) { return true; }
    return Util.isBetweenAngles(angle, this.leftLimit, this.rightLimit);
  }

  isPointVisible(point: Vector, segments: Segment[]) {
    const { origin } = this;
    const ray = this.castToPoint(point);
    const intersections: Vector[] = [];

    for (const segment of segments) {
      const intersection = ray.collidesWithSegment(segment);
      if (!intersection) { continue; }
      if (origin.distanceTo(intersection) > origin.distanceTo(point)) { continue; }
      if (intersection.distanceTo(point) <= 2 ** -10) { continue; }
      intersections.push(intersection);
    }

    return intersections.length === 0 && this.inViewLimits(point);
  }

  getVisibleSegments(segments: Segment[]) {
    const { origin } = this;
    const segmentVisbility: Map<Segment, SegmentVisibilility> = new Map();

    for (const segment of segments) {
      segmentVisbility.set(segment, SegmentVisibilility.Invisible);

      const { start, end } = segment;

      if (!this.inViewLimits(start) && !this.inViewLimits(end)) { continue; }

      const isStartVisible = this.isPointVisible(start, segments);
      const isEndVisible = this.isPointVisible(end, segments);

      if (isStartVisible && isEndVisible) {
        segmentVisbility.set(segment, SegmentVisibilility.Visible);
      } else if (isStartVisible) {
        segmentVisbility.set(segment, SegmentVisibilility.PartiallyVisibleStart);
      } else if (isEndVisible) {
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

  move(relativeDirection: number, distance: number) {
    this.origin = this.origin.add(Vector.fromAngle(this.angle + relativeDirection).scale(distance));
  }
}
