import { BoardData } from "@/boards";

export function resize(board: BoardData, ctx: CanvasRenderingContext2D, maxW: number, maxH: number) {
  const canvas = ctx.canvas;

  const ratio = squareRatio(board);

  console.log(ratio);

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