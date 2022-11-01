import { Grid } from "@/lib/base/Grid";

export abstract class GridRenderer {
  constructor(public grid: Grid, protected ctx: CanvasRenderingContext2D) {}

  public render() {
    const { ctx } = this;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  abstract ratio(): number;

  resize(maxW: number, maxH: number) {
    const canvas = this.ctx.canvas;
    const ratio = this.ratio();

    if (maxH * ratio > maxW) {
      canvas.width = maxW;
      canvas.height = maxW / ratio;
    } else {
      canvas.width = maxH * ratio;
      canvas.height = maxH;
    }
  }
}
