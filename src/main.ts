import type { Point } from './interface/point'
import drawRect from './scripts/drawRect'

import getMousePosInCanvas from './scripts/getMousePosInCanvas';
import normalizeRect from './scripts/normalizeRect'
import resizeCanvas from './scripts/resizeCanvas';

import './style.css';

// Get app container
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('#app not found');


// Set up HTML structure
app.innerHTML = `
  <div class="canvas-wrap">
    <canvas id="canvas" aria-label="Selection canvas"></canvas>
  </div>
`;


// Get canvas and context
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d')!;

// State variables
let isSelecting = false;
let startPosition: Point | null = null;
let endPosition: Point | null = null;
let currentPosition: Point | null = null;



// Event Listeners
// TODO: Add to helpers/utils file instead of main
window.addEventListener('resize', () => resizeCanvas(canvas, ctx), { passive: true });

// get start position on pointer down
canvas.addEventListener('pointerdown', (e: PointerEvent) => {
  canvas.setPointerCapture(e.pointerId);
  startPosition = getMousePosInCanvas(canvas, e);
  isSelecting = true;
});

// Update current position on pointer move
canvas.addEventListener('pointermove', (e: PointerEvent) => {
  currentPosition = getMousePosInCanvas(canvas, e);
});

// get end position on pointer up
canvas.addEventListener('pointerup', (e: PointerEvent) => {
  canvas.releasePointerCapture(e.pointerId);
  endPosition = currentPosition;
  isSelecting = false;
});



// Utility to create a Rect from two Points


// Animation loop, might use for  more complex stuff later
function update() {
  if (isSelecting && startPosition && currentPosition) {
    const rect = normalizeRect(startPosition, currentPosition);
    drawRect(currentPosition, startPosition, rect, canvas, ctx);
  }

  requestAnimationFrame(update);
}

// main loop
update();
resizeCanvas(canvas, ctx);
