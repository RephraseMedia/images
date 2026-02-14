/**
 * Create an empty mask canvas (all black = no selection).
 */
export function createEmptyMask(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  return canvas;
}

/**
 * Export a canvas to a base64 PNG data URI.
 */
export function canvasToBase64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

/**
 * Check if a mask has any painted area (any white pixels).
 */
export function isMaskEmpty(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d');
  if (!ctx) return true;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Check every 4th pixel (R channel) for non-black pixels
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 0) return false;
  }
  return true;
}

/**
 * Draw a brush stroke circle on a mask canvas.
 */
export function drawBrushStroke(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  opacity: number = 1
): void {
  ctx.globalAlpha = opacity;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

/**
 * Draw a line between two points on a mask canvas (for smooth brush strokes).
 */
export function drawBrushLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  size: number,
  opacity: number = 1
): void {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.max(1, Math.ceil(distance / (size / 4)));

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + dx * t;
    const y = y1 + dy * t;
    drawBrushStroke(ctx, x, y, size, opacity);
  }
}

/**
 * Clear a mask canvas (reset to all black).
 */
export function clearMask(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draw a checkerboard pattern to represent transparency.
 */
export function drawCheckerboard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number = 10
): void {
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const isEven = ((x / cellSize) + (y / cellSize)) % 2 === 0;
      ctx.fillStyle = isEven ? '#cccccc' : '#ffffff';
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
}
