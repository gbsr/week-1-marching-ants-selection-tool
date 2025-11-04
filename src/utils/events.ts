import asserts from "./asserts"
import getMousePosInCanvas, { setPointerCursor } from "./pointer"
import finalizeSelect from "../actions/finalizeSelect"

import { hitEdge, pointInsideRect } from "./geometry"
import type { SelectionState } from "../state/state"

export default function registerEvents(
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D, 
  state: SelectionState) {

    // edge cases
    canvas.addEventListener('pointercancel', () => { state.mode='idle'; state.dragOffset=null; });
    canvas.addEventListener('lostpointercapture', () => { state.mode='idle'; state.dragOffset=null; });
    canvas.style.touchAction = 'none';


  // clear selection on Escape key press
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      state.mode = 'idle';
      state.startPosition = null;
      state.currentPosition = null;
      state.endPosition = null;
      state.finalSelection = null;
      state.dragOffset = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
  
  // get start position on pointer down
  canvas.addEventListener('pointerdown', (e: PointerEvent) => {

    asserts('on pointerdown: ', state);

    canvas.setPointerCapture(e.pointerId);
    const mouse = getMousePosInCanvas(canvas, e);
    
    // move
    if (state.finalSelection && pointInsideRect(mouse, state.finalSelection)) {
      state.mode = 'move';
      state.dragOffset = {
        x: mouse.x - state.finalSelection.x,
        y: mouse.y - state.finalSelection.y
      };
      asserts('after setting move mode: ', state);
      console.log('Entering move mode');
      return;
    }   

    // select
    state.mode = 'select';
    state.startPosition = mouse;
    state.currentPosition = mouse;
    state.finalSelection = null;
    asserts('after setting select mode: ', state);
    console.log('Entering select mode');
  });


// Update current position on pointer move
canvas.addEventListener('pointermove', (e: PointerEvent) => {

    const mouse = getMousePosInCanvas(canvas, e);

    // TODO: refactor + improve logic, base for now
    const checkEdge = hitEdge(mouse, state.finalSelection!);

    if (checkEdge.top) {
      setPointerCursor('ns-resize', canvas);
    }
    if (checkEdge.bottom) {
      setPointerCursor('ns-resize', canvas);
    }
    if (checkEdge.left) {
      setPointerCursor('ew-resize', canvas);
      console.log('Mouse is at the left edge');
    }
    if (checkEdge.right) {
      console.log('Mouse is at the right edge');
    }

    if(state.mode === 'select') {
    state.currentPosition = mouse;
    asserts('during select pointermove: ', state);
  }
  else if (state.mode === 'move' && state.finalSelection && state.dragOffset) {
    state.finalSelection.x = mouse.x - state.dragOffset.x;
    state.finalSelection.y = mouse.y - state.dragOffset.y;
    asserts('during move pointermove: ', state);
  }
  // if mode is idle, do nothing  
});

// get end position on pointer up
canvas.addEventListener('pointerup', (e) => {

  canvas.releasePointerCapture(e.pointerId);
  const mouse = getMousePosInCanvas(canvas, e);

    if(state.mode === 'select') {
      finalizeSelect(state, mouse);
      asserts('after finalizeSelect: ', state);
    }

    if (state.mode === 'move') {
      state.mode = 'idle';
      state.dragOffset = null;
      console.log('Exiting move mode');
      asserts('after exiting move mode: ', state);
    }

  });

};
  