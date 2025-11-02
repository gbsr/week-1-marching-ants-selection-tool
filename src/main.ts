import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('#app not found');

app.innerHTML = `
  <div class="canvas-wrap">
    <canvas id="canvas" aria-label="Selection canvas"></canvas>
  </div>
`;

// Get canvas and context
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d')!;


// Resize canvas to fit its CSS size and device pixel ratio
function resizeCanvas() {
  // CSS size (layout)
  const rect = canvas.getBoundingClientRect();

  // Device pixel ratio for crisp lines on HiDPI
  const dpr = window.devicePixelRatio || 1;

  // Set the drawing buffer size (MUST be numbers)
  canvas.width  = Math.max(1, Math.floor(rect.width  * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  // Reset transform so 1 unit = 1 CSS pixel when drawing
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Test draw
  drawTest();
}

function drawTest() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#4caf50';
  ctx.strokeRect(20, 20, 160, 100);
}

window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();