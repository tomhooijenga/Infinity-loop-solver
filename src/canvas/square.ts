import { Tile } from "@/lib/base/Tile";
import { GridRenderer, TileRenderer } from "@/canvas";
import { Grid } from "@/lib/base/Grid";
import { arc, rad } from "@/canvas/util";

function ratio(grid: Grid): number {
  return grid.width / grid.height;
}

function render(ctx: CanvasRenderingContext2D, grid: Grid, tile: Tile) {
  const size = ctx.canvas.width / grid.width;
  const { x, y, direction } = tile;
  const dx = size * x;
  const dy = size * y;

  // ctx.beginPath();
  // ctx.strokeStyle = "blue";
  // ctx.strokeRect(dx, dy, size, size);
  //
  // ctx.beginPath();
  // ctx.fillStyle = "green";
  // ctx.fillRect(dx + size / 2 - 0.5, dy, 1, size);
  // ctx.fillRect(dx, dy + size / 2 - 0.5, size, 1);

  ctx.save();
  ctx.translate(dx + size / 2, dy + size / 2);
  ctx.rotate(rad(90 * direction));
  ctx.translate((dx + size / 2) * -1, (dy + size / 2) * -1);

  renderers[tile.type](ctx, tile, size, size, dx, dy);
  ctx.restore();
}

const renderers: Record<string, TileRenderer> = {
  None(ctx, tile, size, _, x, y) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = (size / 100) * 2;

    arc(ctx, size, cx, cy, r, 0, 360, false, "fill");
  },
  Cross(ctx, tile, size, _, x, y) {
    const r = size / 2;

    arc(ctx, size, x, y, r, 0, 90);
    arc(ctx, size, x + size, y, r, 90, 90);
    arc(ctx, size, x + size, y + size, r, 180, 90);
    arc(ctx, size, x, y + size, r, 270, 90);
  },
  End(ctx, tile, size, _, x, y) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const percent = size / 100;
    const r = percent * 25;

    arc(ctx, size, cx, cy, r, 0, 360);

    ctx.fillStyle = "darkRed";
    ctx.fillRect(cx - percent * 5, y, percent * 10, size / 2 - r - percent * 4);
    ctx.fillStyle = "red";
    ctx.fillRect(cx - percent * 3, y, percent * 6, size / 2 - r - percent * 2);
  },
  Junction(ctx, tile, size, _, x, y) {
    const r = (size / 100) * 50;

    arc(ctx, size, x + size, y, r, 90, 90);
    arc(ctx, size, x + size, y + size, r, 180, 90);
  },
  Line(ctx, tile, size, _, x, y) {
    const percent = size / 100;

    ctx.fillStyle = "darkRed";
    ctx.fillRect(x + size / 2 - percent * 5, y, percent * 10, size);
    ctx.fillStyle = "red";
    ctx.fillRect(x + size / 2 - percent * 3, y, percent * 6, size);
  },
  Turn(ctx, tile, size, _, x, y) {
    const r = (size / 100) * 50;

    arc(ctx, size, x + size, y, r, 90, 90);
  },
};

export const renderer: GridRenderer = {
  ratio,
  render,
};
