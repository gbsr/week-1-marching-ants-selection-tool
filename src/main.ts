import { state } from './state/state'

import registerEvents from './utils/events'
import normalizeRect from './utils/normalizeRect'
import resizeCanvas from './system/resizeCanvas';
import march from './render/animateAnts'
import config from './config'

import './style.css';
import asserts from './utils/asserts'

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

// register event listeners
registerEvents(canvas, ctx, state);



function update() {
  const now = performance.now();
  const dt  = (now - lastTime) / 1000;
  lastTime  = now;

  const speed   = config.antSpeed;
  const pattern = config.antLength + config.antSpacing;
  offset = (offset + speed * dt) % pattern;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw current selection (preview)
    if (state.startPosition && state.currentPosition && !state.finalSelection) {
      const rect = normalizeRect(state.startPosition, state.currentPosition);
      march(canvas, ctx, offset, rect, config);
    }
    // draw finalized selection (idle or move)
    else if (state.finalSelection) {
      march(canvas, ctx, offset, state.finalSelection, config);
  }
  requestAnimationFrame(update);
}

// main loop
update();
resizeCanvas(canvas, ctx);
