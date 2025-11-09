import config from "../config"
import type { Point } from "../interface/point"
import type { Rect } from "../interface/rect"
import type { Handle } from "../interface/handle"
import getMousePosInCanvas from "./pointer"

export default function checkIfInsideRect(
  canvas: HTMLCanvasElement,
  e: PointerEvent,
  rectPos: { x: number; y: number; width: number; height: number }
) 

  {
    const mousePos = getMousePosInCanvas(canvas, e);
    return (
      mousePos.x >= rectPos.x &&
      mousePos.x <= rectPos.x + rectPos.width &&
      mousePos.y >= rectPos.y &&
      mousePos.y <= rectPos.y + rectPos.height
    );
}

export function pointInsideRect(mouse: Point, finalSelection: Rect) {
  return (
    mouse.x >= finalSelection.x &&
    mouse.x <= finalSelection.x + finalSelection.width &&
    mouse.y >= finalSelection.y &&
    mouse.y <= finalSelection.y + finalSelection.height
  );
}

function near(value: number, target: number, tolerance: number) {
  return Math.abs(value - target) <= tolerance;
}

function between(value: number, min: number, max: number, pad = 0) {
  return value >= min - pad && value <= max + pad;
}

export function hitEdge(mouse: Point, rect: Rect): Handle {
  const tolerance = config.edge;

  const onLeft = near(mouse.x, rect.x, tolerance);
  const onRight = near(mouse.x, rect.x + rect.width, tolerance);
  const onTop = near(mouse.y, rect.y, tolerance);
  const onBottom = near(mouse.y, rect.y + rect.height, tolerance);

  const inVerticalBounds = between(
    mouse.y,
    rect.y,
    rect.y + rect.height,
    tolerance
  );
  const inHorizontalBounds = between(
    mouse.x,
    rect.x,
    rect.x + rect.width,
    tolerance
  );

  if (onLeft && onTop) return "top-left";
  if (onRight && onTop) return "top-right";
  if (onLeft && onBottom) return "bottom-left";
  if (onRight && onBottom) return "bottom-right";

  if (onLeft && inVerticalBounds) return "left";
  if (onRight && inVerticalBounds) return "right";
  if (onTop && inHorizontalBounds) return "top";
  if (onBottom && inHorizontalBounds) return "bottom";

  return null;
}