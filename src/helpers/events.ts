import getMousePosInCanvas from "../scripts/getMousePosInCanvas"
import normalizeRect from "../scripts/normalizeRect"
import resizeCanvas from "../scripts/resizeCanvas"
import type { SelectionState } from "./state"

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
  });

  // get start position on pointer down
canvas.addEventListener('pointerdown', (e: PointerEvent) => {
  canvas.setPointerCapture(e.pointerId);
  state.startPosition = getMousePosInCanvas(canvas, e);
  state.mode = 'select';
  console.log({ 'mode switched: ': state.mode.toString() });
  console.log({ 'we are selecting ': state.mode.toString() });
});

// Update current position on pointer move
canvas.addEventListener('pointermove', (e: PointerEvent) => {
  state.currentPosition = getMousePosInCanvas(canvas, e);
});

// get end position on pointer up
canvas.addEventListener('pointerup', (e) => {
  canvas.releasePointerCapture(e.pointerId);
  state.endPosition = state.currentPosition;
  if (state.startPosition && state.endPosition) state.finalSelection = normalizeRect(state.startPosition, state.endPosition);
  state.mode = 'idle';
  console.log({ 'mode switched: ': state.mode.toString() });
});

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
    console.log({ 'mode switched: ': state.mode.toString() });
  } else {
    canvas.style.cursor = 'default';
  }
});

  // resize canvas on window resize
window.addEventListener('resize', () => resizeCanvas(canvas, ctx), { passive: true });


}