import { Grid } from "@/lib/base/Grid";
import { TileRenderer, colors } from "@/canvas";
import { Tile } from "@/lib/base/Tile";

export abstract class GridRenderer {
  protected tileCache: Record<string, HTMLCanvasElement> = {};

  protected tileRenderers: Record<string, TileRenderer> = {};

  constructor(public grid: Grid, protected ctx: CanvasRenderingContext2D) {}

  abstract render(tiles: Tile[]): void;

  protected renderTile(
    tile: Tile,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const ctx = this.ctx;

    if (!tile.solved) {
      this.drawTileOutline(tile, x, y, width, height, width / 100 * 5);
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.red;
      ctx.stroke();
    }

    ctx.drawImage(this.tileCache[tile.type], x, y, width, height);
  }

  abstract clearTile(
    tile: Tile,
    x: number,
    y: number,
    width: number,
    height: number
  ): void;

  abstract tileSize(): { width: number; height: number };

  abstract drawTileOutline(tile: Tile, x: number, y: number, width: number, height: number, inset: number): void;

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
