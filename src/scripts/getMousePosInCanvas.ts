import type { Point } from '../interface/point';

export default function getMousePosInCanvas(canvas: HTMLCanvasElement, evt: PointerEvent): Point {
  const rect = canvas.getBoundingClientRect();

  return {
    x: (evt.clientX - rect.left),
    y: (evt.clientY - rect.top)
  }
}