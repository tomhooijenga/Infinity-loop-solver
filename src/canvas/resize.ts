import { BoardData } from "@/boards";
import { Tile } from "@/lib/base/Tile";
import { toRaw } from "vue";

export function resize(
  board: BoardData,
  ctx: CanvasRenderingContext2D,
  maxW: number,
  maxH: number
) {
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
  const x = board.width;
  const y = board.height;

  return x / y;
}

export function render(board: BoardData, ctx: CanvasRenderingContext2D) {
  const { width, tiles } = toRaw(board);
  const tileWidth = ctx.canvas.width / width;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.tiles.forEach((tile) => renderSquare(ctx, tile, tileWidth));
}

function renderSquare(ctx: CanvasRenderingContext2D, tile: Tile, size: number) {
  const { x, y, direction } = tile;
  const dx = size * x;
  const dy = size * y;

  ctx.beginPath();
  ctx.strokeStyle = "blue";
  ctx.strokeRect(dx, dy, size, size);

  ctx.beginPath();
  ctx.fillStyle = "green";
  ctx.fillRect(dx + size / 2 - 0.5, dy, 1, size);
  ctx.fillRect(dx, dy + size / 2 - 0.5, size, 1);

  ctx.save();
  // ctx.translate(dx + size / 2, dy + size / 2);
  // const rotate = 360 / tile sides * tile.direction * Math.PI / 180
  // ctx.rotate(rotate);
  // ctx.translate((dx + size / 2) * -1, (dy + size / 2) * -1);

  square[tile.type]?.(ctx, tile, size, dx, dy);
  ctx.restore();
}

type TileRenderer = (
  ctx: CanvasRenderingContext2D,
  tile: Tile,
  size: number,
  x: number,
  y: number
) => void;

const square: Record<string, TileRenderer> = {
  None(ctx: CanvasRenderingContext2D, tile: Tile, size, x, y) {
    const cx = x + size / 2;
    const cy = y + size / 2;

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(cx, cy, (size / 100) * 2, 0, 2 * Math.PI);
    ctx.fill();
  },
  Cross(ctx: CanvasRenderingContext2D, tile: Tile, size, x, y) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = (size / 100) * 6;

    // top left
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0,0.5 * Math.PI);
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
  End(ctx: CanvasRenderingContext2D, tile: Tile, size, x, y) {
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
  Junction(ctx: CanvasRenderingContext2D, tile: Tile, size, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0,0.5 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + size, y, size / 2, 0.5 * Math.PI, Math.PI);
    ctx.stroke();
  },
  Line(ctx: CanvasRenderingContext2D, tile: Tile, size, x, y) {
    const lineWidth = (size / 100) * 6;
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(x + size / 2 - lineWidth / 2, y, lineWidth, size);
  },
  Turn(ctx: CanvasRenderingContext2D, tile: Tile, size, x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = (size / 100) * 6;
    ctx.arc(x + size, y, size / 2, 0.5 * Math.PI, Math.PI);
    ctx.stroke();
  },
};

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
