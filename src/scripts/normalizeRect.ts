import type { Point } from "../interface/point"
import type { Rect } from "../interface/rect"

// normalize rect from two points
export default function normalizeRect(a: Point, b: Point): Rect {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);

  const width  = Math.abs(a.x - b.x);
  const height = Math.abs(a.y - b.y);

  return { x, y, width, height };
}