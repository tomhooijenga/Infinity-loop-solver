import { GridRenderer, TileRenderer } from "@/canvas/index";
import { Tile } from "@/lib/base/Tile";
import { Grid } from "@/lib/solver/triangle/Grid";

const TRIANGLE_RATIO = 0.8660254037844386;

function ratio(grid: Grid) {
  const width = grid.width / 2 + 0.5;
  const height = grid.height * TRIANGLE_RATIO;

  return width / height;
}

// const gridStyle = computed((): CSSProperties => {
//   const x = (props.x + 1) / 2;
//   const y = props.y * 0.8660254037844386;
//
//   return {
//     "grid-template-columns": `repeat(${props.x + 1}, 1fr)`,
//     "grid-template-rows": `repeat(${props.y}, 1fr)`,
//     "aspect-ratio": `${x}/${y}`,
//   };
// });

function render(ctx: CanvasRenderingContext2D, grid: Grid, tile: Tile) {
  const horizontalTiles = grid.width / 2 + 0.5;
  const width = ctx.canvas.width / horizontalTiles;
  const height = ctx.canvas.height / grid.height;
  const { x, y, direction } = tile;
  const dy = height * y;
  const dx = width * (x / 2);

  ctx.save();

  if (!grid.isPointyUp(tile)) {
    ctx.translate(dx + width / 2, dy + height / 2);
    ctx.rotate(Math.PI);
    ctx.translate((dx + width / 2) * -1, (dy + height / 2) * -1);
  }

  ctx.strokeStyle = "green";
  ctx.beginPath();
  ctx.strokeRect(dx, dy, width, height);

  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(dx + width / 2, dy);
  ctx.lineTo(dx + width, dy + height);
  ctx.lineTo(dx, dy + height);
  ctx.closePath();
  ctx.stroke();

  // ctx.translate(dx + width / 2, dy + width / 2);
  // const rotate =
  //   ((360 / grid.directionUtil.numSides) * direction * Math.PI) / 180;
  // ctx.rotate(rotate);
  // ctx.translate((dx + width / 2) * -1, (dy + width / 2) * -1);

  renderers[tile.type]?.(ctx, tile, width, dx, dy);
  ctx.restore();
}

// function tileStyle(tile: TileType): CSSProperties {
//   let rotate = tile.direction * 120;
//
//   if (!pointyUp(tile)) {
//     // 180 to flip it, 120 to make down actually down again.
//     rotate += 300;
//   }
//
//   return {
//     gridRow: `${tile.y + 1} / span 1`,
//     gridColumn: `${tile.x + 1} / span 2`,
//     transform: `rotate(${rotate}deg)`,
//     transformOrigin: "50% 66.66666%",
//     position: "relative",
//     top: pointyUp(tile) ? 0 : "-33%",
//   };
// }

const renderers: Record<string, TileRenderer> = {
  None(ctx, tile, size, x, y) {
    const cx = x + size / 2;
    const cy = y + size / 2;

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(cx, cy, (size / 100) * 2, 0, 2 * Math.PI);
    ctx.fill();
  },
};

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
