// todo
export { renderer } from '@/canvas/square';

// function triangleRatio(board: BoardData): number {
//   const x = (board.width + 1) / 2;
//   const y = board.height * 0.8660254037844386;
//
//   return x / y;
// }
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