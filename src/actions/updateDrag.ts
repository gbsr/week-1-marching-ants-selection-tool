import type { Point } from "../interface/point"
import type { Rect } from "../interface/rect"

export default function updateRect(currentMousePosition: Point, finalPosition: Rect) {
  const dx = currentMousePosition.x - finalPosition.x;
  const dy = currentMousePosition.y - finalPosition.y;

  finalPosition.x += dx;
  finalPosition.y += dy;
}
