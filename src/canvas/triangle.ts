import { GridRenderer } from "@/canvas/index";
import { Grid } from "@/lib/base/Grid";
import { Tile } from "@/lib/base/Tile";

function ratio(grid: Grid) {
  const width = (grid.width + 1) / 2;
  const height = grid.height * 0.8660254037844386;

  return width / height;
}

function render(ctx: CanvasRenderingContext2D, grid: Grid, tile: Tile) {
  //
}

export const renderer: GridRenderer = {
  ratio,
  render,
};

//
// function triangle(ctx: CanvasRenderingContext2D, w, x, y) {
//   const h = w * 0.8660254037844386;
//   const dx = w * x;
//   const dy = h * y;
//
//   ctx.beginPath();
//
//   ctx.moveTo(dx + w / 2, dy);
//   ctx.lineTo(dx + w, dy + h);
//   ctx.lineTo(dx, dy + h);
//   ctx.fill();
// }