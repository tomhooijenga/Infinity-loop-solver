import { Grid } from "@/lib/base/Grid";
import { colors, TileRenderer } from "@/canvas";
import { Tile } from "@/lib/base/Tile";
import { Animation } from "@/canvas/animation";

export abstract class GridRenderer {
  protected tileCache: Record<string, HTMLCanvasElement> = {};

  protected tileRenderers: Record<string, TileRenderer> = {};

  protected animations = new Map<Tile, Animation>();

  protected highlighted = new Set<Tile>();

  constructor(public grid: Grid, protected ctx: CanvasRenderingContext2D) {}

  abstract render(tiles: Tile[]): void;

  protected renderTile(
    tile: Tile,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    this.ctx.drawImage(this.tileCache[tile.type], x, y, width, height);
  }

  protected renderOutline(
    tile: Tile,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    this.drawTileOutline(tile, x, y, width, height, (width / 100) * 5);
    const ctx = this.ctx;
    ctx.lineWidth = width / 100;
    ctx.strokeStyle = colors.redOutline;
    ctx.stroke();
  }

  public highlight(tiles: Tile[]) {
    const previous = [...this.highlighted];
    this.highlighted.clear();
    tiles.forEach((tile) => this.highlighted.add(tile));

    this.render([...previous, ...tiles]);
  }

  protected renderHighlight(
    tile: Tile,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const ctx = this.ctx;

    ctx.save();

    this.drawTileOutline(tile, x, y, width, height, 0);

    ctx.clip();
    ctx.fillStyle = colors.hover;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
  }

  abstract clearTile(
    tile: Tile,
    x: number,
    y: number,
    width: number,
    height: number
  ): void;

  abstract tileSize(): { width: number; height: number };

  abstract tilePosition(tile: Tile): {
    x: number;
    y: number;
    cx: number;
    cy: number;
    shapeCx: number;
    shapeCy: number;
  };

  abstract drawTileOutline(
    tile: Tile,
    x: number,
    y: number,
    width: number,
    height: number,
    inset: number
  ): void;

  abstract ratio(): number;

  getTileFromPoint(pointX: number, pointY: number): Tile | undefined {
    const { width, height } = this.tileSize();
    return this.grid.tiles.find((tile) => {
      const { x, y } = this.tilePosition(tile);
      this.drawTileOutline(tile, x, y, width, height, 0);

      return this.ctx.isPointInPath(pointX, pointY);
    });
  }

  animate(tile: Tile, from: number) {
    const anim = new Animation(tile, this, {
      from,
      to: tile.direction,
    });

    this.animations.get(tile)?.stop();
    this.animations.set(tile, anim);

    anim.start();
  }

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
