import type { Point } from "../interface/point"
import type { Rect } from "../interface/rect"
import getMousePosInCanvas from "./pointer"
import resizeCanvas from "../system/resizeCanvas"
import finalizeSelect from "../actions/finalizeSelect"
import type { SelectionState } from "../state/state"
import asserts from "./asserts"

export default function registerEvents(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, state: SelectionState) {

  // clear selection on Escape key press
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      state.mode = 'idle';
      state.startPosition = null;
      state.currentPosition = null;
      state.endPosition = null;
      state.finalSelection = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    asserts(state);
  });
  
  // get start position on pointer down
  canvas.addEventListener('pointerdown', (e: PointerEvent) => {
    
    // If there's a final selection, check if the pointer is inside it
    const mouse = getMousePosInCanvas(canvas, e);
    

    if (state.finalSelection) {
      const inside = pointInsideRect(mouse, state.finalSelection);
      asserts(state);

      if (inside) {
    
        state.mode = 'move';
        asserts(state);

        // not inside final selection
      } else {
        state.mode = 'select';
        state.startPosition = getMousePosInCanvas(canvas, e);
        state.finalSelection = null; // Clear previous selection
        asserts(state);
      }
    }

canvas.setPointerCapture(e.pointerId);
state.startPosition = getMousePosInCanvas(canvas, e);
});

// Update current position on pointer move
canvas.addEventListener('pointermove', (e: PointerEvent) => {
  if(!state.finalSelection) return;

  let dragOffsetX = getMousePosInCanvas(canvas, e).x - state.finalSelection.x;
  let dragOffsetY = getMousePosInCanvas(canvas, e).y - state.finalSelection.y;
  if( state.mode === 'move' && state.finalSelection) {
    state.finalSelection.x = getMousePosInCanvas(canvas, e).x - dragOffsetX;
    state.finalSelection.y = getMousePosInCanvas(canvas, e).y - dragOffsetY;
    asserts(state);
    return;
  }
  
  state.currentPosition = getMousePosInCanvas(canvas, e);
});

// get end position on pointer up
canvas.addEventListener('pointerup', (e) => {
  canvas.releasePointerCapture(e.pointerId);

  const mouse = getMousePosInCanvas(canvas, e);

  if(state.mode === 'select') {
    finalizeSelect(state, mouse);
  asserts(state);
  }

  if(state.mode === 'move') {
    asserts(state);
    // move here
  }
});


    state.mode = 'idle';

canvas.addEventListener('click', (e) => {
  if (!state.finalSelection) return;

  const mousePos = getMousePosInCanvas(canvas, e);
  if (
    mousePos.x >= state.finalSelection.x &&
    mousePos.x <= state.finalSelection.x + state.finalSelection.width &&
    mousePos.y >= state.finalSelection.y &&
    mousePos.y <= state.finalSelection.y + state.finalSelection.height

   && state.mode === 'idle') {
    canvas.style.cursor = 'pointer';
    state.mode = 'move';
    asserts(state);
  } else {
    canvas.style.cursor = 'default';
    asserts(state);
  }
});

  // resize canvas on window resize
window.addEventListener('resize', () => resizeCanvas(canvas, ctx), { passive: true });

}

function pointInsideRect(mouse: Point, finalSelection: Rect) {
  return (
    mouse.x >= finalSelection.x &&
    mouse.x <= finalSelection.x + finalSelection.width &&
    mouse.y >= finalSelection.y &&
    mouse.y <= finalSelection.y + finalSelection.height
  );
}



