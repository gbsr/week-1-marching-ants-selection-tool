import asserts from "./asserts"
import getMousePosInCanvas, { setPointerCursor } from "./pointer"
import finalizeSelect from "../actions/finalizeSelect"

import { hitEdge, pointInsideRect } from "./geometry"
import type { SelectionState } from "../state/state"
import type { Rect } from "../interface/rect"
import type { Point } from "../interface/point"
import type { Handle } from "../interface/handle"

export default function registerEvents(
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D, 
  state: SelectionState) {

  // edge cases
  canvas.addEventListener('pointercancel', () => { 
    state.mode='idle'; 
    state.dragOffset=null; 
    state.resizeHandle=null;
  });

  canvas.addEventListener('lostpointercapture', () => { 
    state.mode='idle'; 
    state.dragOffset=null;
    state.resizeHandle=null;
  });

  canvas.style.touchAction = 'none';

  // clear selection on Escape key press
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      state.mode = 'idle';
      state.startPosition = null;
      state.currentPosition = null;
      state.finalSelection = null;
      state.dragOffset = null;
      state.resizeHandle = null;
      state.hoverHandle = null;
      setPointerCursor("default", canvas);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
  
  // get start position on pointer down
  canvas.addEventListener('pointerdown', (e: PointerEvent) => {
    canvas.setPointerCapture(e.pointerId);
    const mouse = getMousePosInCanvas(canvas, e);
    asserts('on pointerdown: ', state);

    // resize start
    if (state.finalSelection) {
      const handle = hitEdge(mouse, state.finalSelection);
      if (handle) {
        state.mode = "resize";
        state.resizeHandle = handle;
        return;
      }
    }

    // move
    if (state.finalSelection && pointInsideRect(mouse, state.finalSelection)) {
      state.mode = 'move';
      state.dragOffset = {
        x: mouse.x - state.finalSelection.x,
        y: mouse.y - state.finalSelection.y
      };
      asserts('after setting move mode: ', state);
      setPointerCursor("move", canvas);
      return;
    }

    // select
    state.mode = 'select';
    state.startPosition = mouse;
    state.currentPosition = mouse;
    state.finalSelection = null;
    asserts('after setting select mode: ', state);
  });

  canvas.addEventListener('pointermove', (e: PointerEvent) => {
    const mouse = getMousePosInCanvas(canvas, e);

    // handles
    if (state.mode === 'idle' && state.finalSelection) {
      const handle = hitEdge(mouse, state.finalSelection);
      state.hoverHandle = handle;

      // cursor update for hover
      if (!handle) {
        setPointerCursor("default", canvas);
      } else if (handle.includes("left") || handle.includes("right")) {
        setPointerCursor("ew-resize", canvas);
      } else if (handle.includes("top") || handle.includes("bottom")) {
        setPointerCursor("ns-resize", canvas);
      }
      return;
    }

    // resize
    if (state.mode === "resize" && state.finalSelection && state.resizeHandle) {
      resizeRect(state.finalSelection, mouse, state.resizeHandle);
      return;
    }

    
    // select or move updates
    if (state.mode === 'select') {
      state.currentPosition = mouse;
      asserts('during select pointermove: ', state);
    }
    else if (state.mode === 'move' && state.finalSelection && state.dragOffset) {
      state.finalSelection.x = mouse.x - state.dragOffset.x;
      state.finalSelection.y = mouse.y - state.dragOffset.y;
      asserts('during move pointermove: ', state);
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    canvas.releasePointerCapture(e.pointerId);
    const mouse = getMousePosInCanvas(canvas, e);

    // resize end
    if (state.mode === "resize") {
      state.mode = "idle";
      state.resizeHandle = null;
      setPointerCursor("default", canvas);
      return;
    }

    if (state.mode === 'select') {
      finalizeSelect(state, mouse);
      asserts('after finalizeSelect: ', state);
      setPointerCursor("default", canvas);
    }

    if (state.mode === 'move') {
      state.mode = 'idle';
      state.dragOffset = null;
      asserts('after exiting move mode: ', state);
      setPointerCursor("default", canvas);
    }
  });
};


function resizeRect(rect: Rect, mouse: Point, handle: Handle) {
  switch (handle) {
    case "left":
      rect.width += rect.x - mouse.x;
      rect.x = mouse.x;
      break;
    case "right":
      rect.width = mouse.x - rect.x;
      break;
    case "top":
      rect.height += rect.y - mouse.y;
      rect.y = mouse.y;
      break;
    case "bottom":
      rect.height = mouse.y - rect.y;
      break;

    case "top-left":
      rect.width += rect.x - mouse.x;
      rect.height += rect.y - mouse.y;
      rect.x = mouse.x;
      rect.y = mouse.y;
      break;

    case "top-right":
      rect.height += rect.y - mouse.y;
      rect.y = mouse.y;
      rect.width = mouse.x - rect.x;
      break;

    case "bottom-left":
      rect.width += rect.x - mouse.x;
      rect.x = mouse.x;
      rect.height = mouse.y - rect.y;
      break;

    case "bottom-right":
      rect.width = mouse.x - rect.x;
      rect.height = mouse.y - rect.y;
      break;
  }
}