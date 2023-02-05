import { Grid } from "@/lib/base/Grid";
import {
  colors,
  TileInfo,
  TilePosition,
  TileRenderer,
  TileSize,
} from "@/renderer";
import { Tile } from "@/lib/base/Tile";
import { Animation } from "@/renderer/animation";

export abstract class GridRenderer {
  protected tileRendererCache: Record<string, HTMLCanvasElement> = {};

  protected tileRenderers: Record<string, TileRenderer> = {};

  protected tileCache = new Map<Tile, TileInfo>();

  constructor(public grid: Grid, protected ctx: CanvasRenderingContext2D) {}

  abstract render(tiles?: Tile[]): void;

  protected renderTile(tile: Tile): void {
    const {
      size: { width, height },
      position: { x, y },
    } = this.tileInfo(tile);

    this.ctx.drawImage(this.tileRendererCache[tile.type], x, y, width, height);
  }

  protected renderOutline(tile: Tile): void {
    const { size, position } = this.tileInfo(tile);
    const outline = this.tileOutline(size, position, (size.width / 100) * 5);
    const ctx = this.ctx;

    ctx.lineWidth = size.width / 100;
    ctx.strokeStyle = colors.redOutline;
    ctx.stroke(outline);
  }

  public highlight(tiles: Tile[]) {
    for (const [tile, info] of this.tileCache) {
      if (info.highlighted) {
        info.highlighted = false;
        this.render([tile]);
      }
    }

    tiles.forEach((tile) => {
      const info = this.tileInfo(tile);

      info.highlighted = true;
    });

    this.render(tiles);
  }

  protected renderHighlight(tile: Tile) {
    const ctx = this.ctx;
    const {
      outline,
      size: { width, height },
      position: { x, y },
    } = this.tileInfo(tile);

    ctx.save();
    ctx.clip(outline);
    ctx.fillStyle = colors.hover;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
  }

  protected clearTile(tile: Tile) {
    const ctx = this.ctx;
    const {
      outline,
      size: { width, height },
      position: { x, y },
    } = this.tileInfo(tile);

    ctx.save();
    ctx.clip(outline);
    ctx.clearRect(x, y, width, height);
    ctx.restore();
  }

  abstract tileSize(): TileSize;

  abstract tilePosition(tile: Tile, size: TileSize): TilePosition;

  abstract tileOutline(
    size: TileSize,
    position: TilePosition,
    inset: number
  ): Path2D;

  abstract gridRatio(): number;

  getTileFromPoint(pointX: number, pointY: number): Tile | undefined {
    const dpr = window.devicePixelRatio;

    return this.grid.tiles.find((tile) => {
      const { outline } = this.tileInfo(tile);

      return this.ctx.isPointInPath(outline, pointX * dpr, pointY * dpr);
    });
  }

  animate(tile: Tile) {
    const info = this.tileInfo(tile);

    if (info.direction === tile.direction) {
      info.animation?.stop();

      this.render([tile]);

      return;
    }

    const anim = new Animation(tile, this, {
      from: info.direction,
      to: tile.direction,
    });

    info.animation = anim;

    anim.start();
  }

  tileInfo(tile: Tile): TileInfo {
    const tileInfo = this.tileCache.get(tile);

    if (!tileInfo) {
      throw new Error("Invalid tile");
    }

    return tileInfo;
  }

  resize(maxW: number, maxH: number) {
    const canvas = this.ctx.canvas;
    const ratio = this.gridRatio();
    const dpr = window.devicePixelRatio;
    const [width, height] =
      maxH * ratio > maxW ? [maxW, maxW / ratio] : [maxH * ratio, maxH];

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    this.ctx.scale(dpr, dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    this.cacheTilesRenderers();
    this.cacheTileInfo();
  }

  protected cacheTilesRenderers() {
    const { width, height } = this.tileSize();

    Object.entries(this.tileRenderers).forEach(([type, renderer]) => {
      const canvas = document.createElement("canvas");
      const dpr = window.devicePixelRatio;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get context");
      }

      ctx.scale(dpr, dpr);

      renderer(ctx, width, height, 0, 0);

      this.tileRendererCache[type] = canvas;
    });
  }

  protected cacheTileInfo() {
    const size = this.tileSize();

    this.grid.tiles.forEach((tile) => {
      const position = this.tilePosition(tile, size);
      const outline = this.tileOutline(size, position, 0);

      this.tileCache.set(tile, {
        animation: null,
        highlighted: false,
        direction: tile.direction,
        outline,
        position,
        size,
      });
    });
  }
}
