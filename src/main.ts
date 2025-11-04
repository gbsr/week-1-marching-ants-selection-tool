import { state } from './helpers/state'

import registerEvents from './helpers/events'
import config from './config'
import normalizeRect from './scripts/normalizeRect'
import resizeCanvas from './scripts/resizeCanvas';
import march from './scripts/animateAnts'

import './style.css';
import type { Rect } from './interface/rect'

// Main Setup
  // Get app container
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('#app not found');

let lastTime = performance.now();
let offset   = 0;

  // Set up HTML structure
app.innerHTML = `
  <div class="canvas-wrap">
    <canvas id="canvas" aria-label="Selection canvas"></canvas>
  </div>
`;

  // Get canvas and context
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d')!;

registerEvents(canvas, ctx, state);



function update() {
  const now = performance.now();
  const dt  = (now - lastTime) / 1000;
  lastTime  = now;

  const speed   = config.antSpeed;
  const pattern = config.antLength + config.antSpacing;
  offset = (offset + speed * dt) % pattern;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (state.mode === 'select' && state.startPosition && state.currentPosition) {
    const rect = normalizeRect(state.startPosition, state.currentPosition);
    march(canvas, ctx, offset, rect, config);
  } else if (state.finalSelection) {
    march(canvas, ctx, offset, state.finalSelection, config);
  }
  // console.log({ 'mode switched: ': mode });

  requestAnimationFrame(update);
}
// main loop
update();
resizeCanvas(canvas, ctx);
