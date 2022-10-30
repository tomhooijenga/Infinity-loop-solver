import { GridRenderer } from "@/canvas/index";
import { Grid } from "@/lib/base/Grid";

export function render(
  grid: Grid,
  renderer: GridRenderer,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  grid.tiles.forEach((tile) => renderer.render(ctx, grid, tile));
}
