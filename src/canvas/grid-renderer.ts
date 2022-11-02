import { Grid } from "@/lib/base/Grid";
import { TileRenderer } from "@/canvas/index";
import { Tile } from "@/lib/base/Tile";

export abstract class GridRenderer {
  protected tileCache: Record<string, OffscreenCanvas> = {};

  protected tileRenderers: Record<string, TileRenderer> = {};

  constructor(public grid: Grid, protected ctx: CanvasRenderingContext2D) {}

  public render() {
    const { ctx } = this;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  public renderTile(tile: Tile, x, y, width, height) {
    this.ctx.drawImage(this.tileCache[tile.type], x, y, width, height);
  }

  abstract tileSize(): { width: number; height: number };

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

    this.cacheTiles();
  }

  cacheTiles() {
    const { width, height } = this.tileSize();

    Object.entries(this.tileRenderers).forEach(([type, renderer]) => {
      const offscreen = new OffscreenCanvas(width, height);
      const ctx = offscreen.getContext("2d");

      renderer(ctx, width, height, 0, 0);

      this.tileCache[type] = offscreen;
    });
  }
}
