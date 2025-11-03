import config from './config'
import type { Point } from './interface/point'
import type { Rect } from './interface/rect'
import march from './scripts/animateAnts'

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
let offset = 0;
let lastTime = performance.now();

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
canvas.addEventListener('pointerup', (e) => {
  canvas.releasePointerCapture(e.pointerId);
  endPosition = currentPosition;
  if (startPosition && endPosition) finalSelection = normalizeRect(startPosition, endPosition);
  isSelecting = false;
});

// when pointerup, finalize the selection rectangle, so we can keep animating it
let finalSelection: Rect | null = null;

// keyboard listener to clear selection on Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    startPosition = null;
    endPosition = null;
    currentPosition = null;
    finalSelection = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

// check if mouse is inside rect after finilizing selection
canvas.addEventListener('click', (e) => {
  if (!finalSelection) return;
  const mousePos = getMousePosInCanvas(canvas, e);
  if (
    mousePos.x >= finalSelection.x &&
    mousePos.x <= finalSelection.x + finalSelection.width &&
    mousePos.y >= finalSelection.y &&
    mousePos.y <= finalSelection.y + finalSelection.height
  ) {
    canvas.style.cursor = 'pointer';
    console.log('Clicked inside selection rectangle');
  } else {
    canvas.style.cursor = 'default';
    console.log('Clicked outside selection rectangle');
  }
});


function update() {
  const now = performance.now();
  const dt  = (now - lastTime) / 1000;
  lastTime  = now;

  const speed   = config.antSpeed;
  const pattern = config.antLength + config.antSpacing;
  offset = (offset + speed * dt) % pattern;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isSelecting && startPosition && currentPosition) {
    const rect = normalizeRect(startPosition, currentPosition);
    march(canvas, ctx, offset, rect, config);
  } else if (finalSelection) {
    march(canvas, ctx, offset, finalSelection, config);
  }

  requestAnimationFrame(update);
}
// main loop
update();
resizeCanvas(canvas, ctx);
