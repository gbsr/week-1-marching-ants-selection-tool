import type { Point } from '../interface/point';

export default function getMousePosInCanvas(canvas: HTMLCanvasElement, evt: PointerEvent): Point {
  const rect = canvas.getBoundingClientRect();

  return {
    x: (evt.clientX - rect.left),
    y: (evt.clientY - rect.top)
  }
}

export function setPointerCursor(arg0: string, canvas: HTMLCanvasElement) {
    if (!canvas) return;

    // allow a small set of expected cursors, fall back to default otherwise
    const allowed = new Set([
      "ns-resize",
      "ew-resize",
      "nwse-resize",
      "nesw-resize",
      "move",
      "default",
      "pointer",
      "crosshair"
    ]);

    const cursor = allowed.has(arg0) ? arg0 : "default";

    // avoid unnecessary style writes
    if (canvas.style.cursor !== cursor) {
      canvas.style.cursor = cursor;
    }
  }