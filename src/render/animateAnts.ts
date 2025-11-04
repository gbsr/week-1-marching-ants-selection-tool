function march(
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D, 
  offset: number, 
  rect: { x: number; y: number; width: number; height: number }, 
  config: { 
            antLength: number; 
            antSpacing: number; 
            selectionBorderWidth: number 
          }) 

  {
    const { antLength, antSpacing, selectionBorderWidth } = config;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = selectionBorderWidth;
    ctx.setLineDash([antLength, antSpacing]);
    ctx.lineDashOffset = -offset;

    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);  
  }

export default march;