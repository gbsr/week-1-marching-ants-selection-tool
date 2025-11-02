import type { Point } from './interface/point'
import type { Rect } from './interface/rect'
import getMousePosInCanvas from './scripts/getMousePosInCanvas';
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

// Resize canvas to fit its CSS size and device pixel ratio
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = Math.max(1, Math.floor(rect.width  * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// Event Listeners
// TODO: Add to helpers/utils file instead of main
window.addEventListener('resize', resizeCanvas, { passive: true });

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

// normalize rect from two points
function normalizeRect(a: Point, b: Point): Rect {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);

  const width  = Math.abs(a.x - b.x);
  const height = Math.abs(a.y - b.y);

  return { x, y, width, height };
}

// Utility to create a Rect from two Points
function drawRect(rect: Rect) {
  if(currentPosition === null || startPosition === null) return;

  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
}

// Animation loop, might use for  more complex stuff later
function update() {
  if (isSelecting && startPosition && currentPosition) {
    const rect = normalizeRect(startPosition, currentPosition);
    drawRect(rect);
  }

  requestAnimationFrame(update);
}

// main loop
update();
resizeCanvas();
