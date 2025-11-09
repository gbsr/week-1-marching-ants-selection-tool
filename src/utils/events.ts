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

  window.addEventListener('keydown', e => {
    if (e.key === 'Shift') {
      state.isShiftPressed = true;
    }
  });

  window.addEventListener('keyup', e => {
  if (e.key === 'Shift') state.isShiftPressed = false;
});
  
  // get start position on pointer down
  canvas.addEventListener('pointerdown', (e: PointerEvent) => {
    canvas.setPointerCapture(e.pointerId);
    const mouse = getMousePosInCanvas(canvas, e);
    asserts('on pointerdown: ', state);

    if (e.shiftKey) state.isShiftPressed = true;

    // resize start
    if (state.finalSelection) {
      const handle = hitEdge(mouse, state.finalSelection);
      if (handle) {
        state.mode = "resize";
        state.resizeHandle = handle;
        return;
      }
    }

    if (e.shiftKey) {
      state.isShiftPressed = true;
    }

    // shift for square selection
    if (state.isShiftPressed && state.startPosition) {
      const size = Math.min(
        Math.abs(state.startPosition.x - mouse.x),
        Math.abs(state.startPosition.y - mouse.y)
      );
      state.currentPosition = {
        x: state.startPosition.x + size * (mouse.x < state.startPosition.x ? -1 : 1),
        y: state.startPosition.y + size * (mouse.y < state.startPosition.y ? -1 : 1)
      };
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
      resizeRect(state.finalSelection, mouse, state.resizeHandle, state.isShiftPressed);
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

export function toSquare(w: number, h: number, keepSquare: boolean) {
  if (!keepSquare) return { w, h };
  const size = Math.min(Math.abs(w), Math.abs(h));
  return { w: Math.sign(w) * size, h: Math.sign(h) * size };
}

export function resizeRect(rect: Rect, mouse: Point, handle: Handle, keepSquare = false) {
  const dx = mouse.x - rect.x;
  const dy = mouse.y - rect.y;

  const square = (w: number, h: number) => toSquare(w, h, keepSquare);

  switch (handle) {
    case "left": {
      const w = rect.width + (rect.x - mouse.x);
      const { w: W } = square(w, rect.height);
      rect.x += rect.width - W; rect.width = W; break;
    }
    case "right": {
      const { w: W } = square(dx, rect.height);
      rect.width = W; break;
    }
    case "top": {
      const h = rect.height + (rect.y - mouse.y);
      const { h: H } = square(rect.width, h);
      rect.y += rect.height - H; rect.height = H; break;
    }
    case "bottom": {
      const { h: H } = square(rect.width, dy);
      rect.height = H; break;
    }
    case "top-left": {
      const w = rect.width + (rect.x - mouse.x);
      const h = rect.height + (rect.y - mouse.y);
      const { w: W, h: H } = square(w, h);
      rect.x += rect.width - W; rect.y += rect.height - H;
      rect.width = W; rect.height = H; break;
    }
    case "top-right": {
      const { w: W, h: H } = square(dx, rect.height + (rect.y - mouse.y));
      rect.y += rect.height - H; rect.width = W; rect.height = H; break;
    }
    case "bottom-left": {
      const { w: W, h: H } = square(rect.width + (rect.x - mouse.x), dy);
      rect.x += rect.width - W; rect.width = W; rect.height = H; break;
    }
    case "bottom-right": {
      const { w: W, h: H } = square(dx, dy);
      rect.width = W; rect.height = H; break;
    }
  }
}