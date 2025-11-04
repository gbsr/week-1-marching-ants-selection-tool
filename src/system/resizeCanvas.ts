// Resize canvas to fit its CSS size and device pixel ratio
export default function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = Math.max(1, Math.floor(rect.width  * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}