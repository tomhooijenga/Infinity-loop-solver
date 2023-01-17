import { colors } from "@/renderer";

export function rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function arc(
  ctx: CanvasRenderingContext2D,
  width: number,
  x: number,
  y: number,
  r: number,
  start: number,
  amount: number,
  shadow = true,
  draw: "stroke" | "fill" = "stroke"
): void {
  if (shadow) {
    ctx.beginPath();
    ctx.fillStyle = colors.light;
    ctx.strokeStyle = colors.light;
    ctx.lineWidth = (width / 100) * 10;
    ctx.arc(x, y, r, rad(start), rad(start + amount));
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.fillStyle = colors.red;
  ctx.strokeStyle = colors.red;
  ctx.lineWidth = (width / 100) * 6;
  ctx.arc(x, y, r, rad(start), rad(start + amount));

  if (draw === "stroke") {
    ctx.stroke();
  } else {
    ctx.fill();
  }
}

export function curve(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): void {
  ctx.beginPath();
  ctx.lineWidth = (width / 100) * 10;
  ctx.strokeStyle = colors.light;
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(width / 2, height / 2, x2, y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = (width / 100) * 6;
  ctx.strokeStyle = colors.red;
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(width / 2, height / 2, x2, y2);
  ctx.stroke();
}
