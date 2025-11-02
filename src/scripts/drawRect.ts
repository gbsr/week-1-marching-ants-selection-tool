import type { Point } from "../interface/point"
import type { Rect } from "../interface/rect"

export default function drawRect(currentPosition: Point | null, startPosition: Point | null, rect: Rect, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  if(currentPosition === null || startPosition === null) return;

  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
}