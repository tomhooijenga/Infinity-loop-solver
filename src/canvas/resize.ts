import { BoardData } from "@/boards";
import { Tile } from "@/lib/base/Tile";

export function resize(board: BoardData, ctx: CanvasRenderingContext2D, maxW: number, maxH: number) {
  const canvas = ctx.canvas;

  const ratio = squareRatio(board);

  if (maxH * ratio > maxW) {
    canvas.width = maxW;
    canvas.height = maxW / ratio;
  } else {
    canvas.width = maxH * ratio;
    canvas.height = maxH;
  }
}

function triangleRatio(board: BoardData): number {
  const x = (board.width + 1) / 2;
  const y = board.height * 0.8660254037844386;

  return x / y;
}

function squareRatio(board: BoardData): number {
  const x = board.width
  const y = board.height

  return x / y;
}

export function render(board: BoardData, ctx: CanvasRenderingContext2D) {

  const tileWidth = ctx.canvas.width / board.width;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.tiles.forEach((tile) => renderSquare(ctx, tile, tileWidth))
}

function renderSquare(ctx: CanvasRenderingContext2D, tile: Tile, size: number) {
  const { x, y, direction } = tile;
  const dx = size * x;
  const dy = size * y;

  // ctx.lineWidth = 1;
  // ctx.strokeStyle = 'white';
  // ctx.strokeText(`${x},${y} ${tile.type}`, dx + 10, dy + 10)

  square[tile.type]?.(ctx, tile, size, dx, dy, );
}

const square = {
  None(ctx: CanvasRenderingContext2D, tile: Tile, size, x, y) {
    const cx = x + size / 2
    const cy = y + size / 2

    // ctx.lineWidth = 1;
    // ctx.strokeStyle = 'white';
    // ctx.strokeText(`${x},${y} ${tile.type}`, cx + 10, cy + 10)

    ctx.beginPath();
    ctx.arc(cx, cy, size / 100 * 2, 0, 2 * Math.PI)
    ctx.fillStyle = 'red';
    ctx.fill();
  }
}

function triangle(ctx: CanvasRenderingContext2D, w, x, y) {
  const h = w * 0.8660254037844386;
  const dx = w * x;
  const dy = h * y;

  ctx.beginPath();

  ctx.moveTo(dx + w / 2, dy);
  ctx.lineTo(dx + w, dy + h);
  ctx.lineTo(dx, dy + h);
  ctx.fill();
}