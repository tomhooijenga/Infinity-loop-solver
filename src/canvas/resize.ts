import { GridRenderer } from "@/canvas/index";
import { Grid } from "@/lib/base/Grid";

export function resize(
  grid: Grid,
  renderer: GridRenderer,
  ctx: CanvasRenderingContext2D,
  maxW: number,
  maxH: number
) {
  const canvas = ctx.canvas;
  const ratio = renderer.ratio(grid);

  if (maxH * ratio > maxW) {
    canvas.width = maxW;
    canvas.height = maxW / ratio;
  } else {
    canvas.width = maxH * ratio;
    canvas.height = maxH;
  }
}
