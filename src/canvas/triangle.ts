import { GridRenderer, TileRenderer } from "@/canvas/index";
import { Tile } from "@/lib/base/Tile";
import { Grid } from "@/lib/solver/triangle/Grid";
import { arc, rad } from "@/canvas/util";

const HEIGHT_RATIO = 1 / (2 / Math.sqrt(3)); // 0.8660
const CENTER_OFFSET = 1 / 1.5; // 0.6666

function ratio(grid: Grid) {
  const width = grid.width / 2 + 0.5;
  const height = grid.height * HEIGHT_RATIO;

  return width / height;
}

function render(ctx: CanvasRenderingContext2D, grid: Grid, tile: Tile) {
  const horizontalTiles = grid.width / 2 + 0.5;
  const width = ctx.canvas.width / horizontalTiles;
  const height = ctx.canvas.height / grid.height;
  const { x, y, direction } = tile;
  const tileX = width * (x / 2);
  const tileY = height * y;
  const squareCx = tileX + width / 2;
  const squareCy = tileY + height / 2;

  ctx.save();

  if (!grid.isPointyUp(tile)) {
    ctx.translate(squareCx, squareCy);
    ctx.rotate(rad(180));
    ctx.translate(-squareCx, -squareCy);
  }

  const triangleCx = squareCx;
  const triangleCy = tileY + height * CENTER_OFFSET;

  ctx.translate(triangleCx, triangleCy);
  let rotate = rad(120 * direction);

  if (!grid.isPointyUp(tile)) {
    rotate += rad(120);
  }

  ctx.rotate(rotate);
  ctx.translate(-triangleCx, -triangleCy);

  renderers[tile.type](ctx, tile, width, height, tileX, tileY);
  ctx.restore();
}

const renderers: Record<string, TileRenderer> = {
  None(ctx, tile, width, height, x, y) {
    const cx = x + width / 2;
    const cy = y + height * CENTER_OFFSET;

    arc(ctx, width, cx, cy, (width / 100) * 2, 0, 360, false, "fill");
  },
  End(ctx, tile, width, height, x, y) {
    const cx = x + width / 2;
    const cy = y + height * CENTER_OFFSET;
    const r = (width / 100) * 15;

    arc(ctx, width, cx, cy, r, 0, 360);

    ctx.translate(cx, cy);
    ctx.rotate(rad(-120));
    ctx.translate(-cx, -cy);

    const percent = width / 100;
    const incircleR = (Math.sqrt(3) / 6) * width;

    ctx.fillStyle = 'darkRed';
    ctx.fillRect(
      cx - percent * 5,
      cy + r + percent * 3,
      percent * 10,
      incircleR - r - percent * 3
    );
    ctx.fillStyle = 'red';
    ctx.fillRect(
      cx - percent * 3,
      cy + r + percent * 2, //  Tiny overlap to prevent edges
      percent * 6,
      incircleR - r - percent * 2
    );
  },
  Turn(ctx, tile, width, height, x, y) {
    arc(ctx, width, x + width, y + height, width / 2, 180, 60);
  },
  Triangle(ctx, tile, width, height, x, y) {
    arc(ctx, width, x + width, y + height, width / 2, 180, 60);
    arc(ctx, width, x, y + height, width / 2, 300, 60);
    arc(ctx, width, x + width / 2, y, width / 2, 60, 60);
  },
};

export const renderer: GridRenderer = {
  ratio,
  render,
};