import type { Point } from './interface/point'
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

canvas.addEventListener('pointermove', (e) => { 
  console.log(`Pointer move: ${e.clientX}, ${e.clientY}`);
});

let isDrawing = false;

function getMousePosInCanvas(evt: PointerEvent): Point {
  const rect = canvas.getBoundingClientRect();

  return {
    x: (evt.clientX - rect.left),
    y: (evt.clientY - rect.top)
  }
}

function drawPointAtMousePos(evt: PointerEvent) {
  const pos = getMousePosInCanvas(evt);
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
  ctx.fill();
}


// TODO: Add to helpers/utils file instead of main
canvas.addEventListener('pointerdown', (e: PointerEvent) => {
  canvas.setPointerCapture(e.pointerId);
  isDrawing = true;
});

canvas.addEventListener('pointerup', (e: PointerEvent) => {
  canvas.releasePointerCapture(e.pointerId);
  isDrawing = false;
});

canvas.addEventListener('pointermove', (e: PointerEvent) => {
  if (isDrawing) {
    drawPointAtMousePos(e);
  }
}
);

window.addEventListener('resize', resizeCanvas, { passive: true });

// Animation loop, might use for  more complex stuff later
function update() {
  requestAnimationFrame(update);
}

// Resize canvas to fit its CSS size and device pixel ratio
function resizeCanvas() {
  // CSS size (layout)
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = Math.max(1, Math.floor(rect.width  * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// main loop
update();
resizeCanvas();