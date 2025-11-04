// Event Listeners

import type { Point } from "../interface/point"
import type { Rect } from "../interface/rect"

// keyboard listener to clear selection on Escape
export default function clearSelectionOnEscape(
                        startPosition: Point | null, 
                        endPosition: Point | null, 
                        currentPosition: Point | null, 
                        finalSelection: Rect | null, 
                        canvas: HTMLCanvasElement, 
                        ctx: CanvasRenderingContext2D)
                      
  {
    window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      startPosition = null;
      endPosition = null;
      currentPosition = null;
      finalSelection = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
}