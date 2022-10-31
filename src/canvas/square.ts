import { Tile } from "@/lib/base/Tile";
import { GridRenderer, TileRenderer } from "@/canvas";
import { Grid } from "@/lib/base/Grid";

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
  const rotate =
    ((360 / grid.directionUtil.numSides) * direction * Math.PI) / 180;
  ctx.rotate(rotate);
  ctx.translate((dx + size / 2) * -1, (dy + size / 2) * -1);

  renderers[tile.type](ctx, tile, size, size, dx, dy);
  ctx.restore();
}

const renderers: Record<string, TileRenderer> = {
  None(ctx, tile, size, _, x, y) {
    const cx = x + size / 2;
    const cy = y + size / 2;

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(cx, cy, (size / 100) * 2, 0, 2 * Math.PI);
    ctx.fill();
  },
  Cross(ctx, tile, size, _, x, y) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = (size / 100) * 6;

    // top left
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, 0.5 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + size, y, size / 2, 0.5 * Math.PI, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + size, y + size, size / 2, Math.PI, 1.5 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y + size, size / 2, 1.5 * Math.PI, 2 * Math.PI);
    ctx.stroke();
  },
  End(ctx, tile, size, _, x, y) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const lineWidth = (size / 100) * 6;
    const r = (size / 100) * 25;

    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillRect(x + size / 2 - lineWidth / 2, y, lineWidth, r);
  },
  Junction(ctx, tile, size, _, x, y) {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.lineWidth = (size / 100) * 6;

    ctx.beginPath();
    ctx.arc(x + size, y, size / 2, 0.5 * Math.PI, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + size, y + size, size / 2, Math.PI, 1.5 * Math.PI);
    ctx.stroke();
  },
  Line(ctx, tile, size, _, x, y) {
    const lineWidth = (size / 100) * 6;
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(x + size / 2 - lineWidth / 2, y, lineWidth, size);
  },
  Turn(ctx, tile, size, _, x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = (size / 100) * 6;
    ctx.arc(x + size, y, size / 2, 0.5 * Math.PI, Math.PI);
    ctx.stroke();
  },
};

export const renderer: GridRenderer = {
  ratio,
  render,
};
