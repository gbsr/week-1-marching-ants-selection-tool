import getMousePosInCanvas from "./pointer"

export default function checkIfInsideRect(canvas: HTMLCanvasElement, e: PointerEvent, rectPos: { x: number; y: number; width: number; height: number }) {

  const mousePos = getMousePosInCanvas(canvas, e);
  if (
    mousePos.x < rectPos.x ||
    mousePos.x > rectPos.x + rectPos.width ||
    mousePos.y < rectPos.y ||
    mousePos.y > rectPos.y + rectPos.height
  ) {
    console.log('Clicked outside final selection');
    return false;
  } else {
    console.log('Clicked inside final selection');
    return true;
  }
}