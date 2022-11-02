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
    ctx.fillStyle = "darkRed";
    ctx.strokeStyle = "darkRed";
    ctx.lineWidth = (width / 100) * 10;
    ctx.arc(x, y, r, rad(start), rad(start + amount));
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.strokeStyle = "red";
  ctx.lineWidth = (width / 100) * 6;
  ctx.arc(x, y, r, rad(start), rad(start + amount));

  if (draw === "stroke") {
    ctx.stroke();
  } else {
    ctx.fill();
  }
}
