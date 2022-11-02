import { Grid } from "@/lib/base/Grid";
import { TileRenderer } from "@/canvas/index";
import { Tile } from "@/lib/base/Tile";

export abstract class GridRenderer {
  protected tileCache: Record<string, HTMLCanvasElement> = {};

  protected tileRenderers: Record<string, TileRenderer> = {};

  constructor(public grid: Grid, protected ctx: CanvasRenderingContext2D) {}

  public render() {
    const { ctx } = this;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  protected renderTile(
    tile: Tile,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
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
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get context");
      }

      renderer(ctx, width, height, 0, 0);

      this.tileCache[type] = canvas;
    });
  }
}
