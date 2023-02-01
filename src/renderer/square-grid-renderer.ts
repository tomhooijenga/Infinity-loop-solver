import { colors, TileRenderer } from "@/renderer";
import { GridRenderer } from "@/renderer/grid-renderer";
import { arc, rad } from "@/renderer/util";
import { Tile } from "@/lib/base/Tile";

export class SquareGridRenderer extends GridRenderer {
  tileRenderers: Record<string, TileRenderer> = {
    None(ctx, size, _, x, y) {
      const cx = x + size / 2;
      const cy = y + size / 2;
      const r = (size / 100) * 2;

      arc(ctx, size, cx, cy, r, 0, 360, false, "fill");
    },
    Cross(ctx, size, _, x, y) {
      const r = size / 2;

      arc(ctx, size, x, y, r, 0, 90);
      arc(ctx, size, x + size, y, r, 90, 90);
      arc(ctx, size, x + size, y + size, r, 180, 90);
      arc(ctx, size, x, y + size, r, 270, 90);
    },
    End(ctx, size, _, x, y) {
      const cx = x + size / 2;
      const cy = y + size / 2;
      const percent = size / 100;
      const r = percent * 25;

      arc(ctx, size, cx, cy, r, 0, 360);

      ctx.fillStyle = colors.light;
      ctx.fillRect(
        cx - percent * 5,
        y,
        percent * 10,
        size / 2 - r - percent * 4
      );
      ctx.fillStyle = colors.red;
      ctx.fillRect(
        cx - percent * 3,
        y,
        percent * 6,
        size / 2 - r - percent * 2
      );
    },
    Junction(ctx, size, _, x, y) {
      const r = (size / 100) * 50;

      arc(ctx, size, x + size, y, r, 90, 90);
      arc(ctx, size, x + size, y + size, r, 180, 90);
    },
    Line(ctx, size, _, x, y) {
      const percent = size / 100;

      ctx.fillStyle = colors.light;
      ctx.fillRect(x + size / 2 - percent * 5, y, percent * 10, size);
      ctx.fillStyle = colors.red;
      ctx.fillRect(x + size / 2 - percent * 3, y, percent * 6, size);
    },
    Turn(ctx, size, _, x, y) {
      const r = (size / 100) * 50;

      arc(ctx, size, x + size, y, r, 90, 90);
    },
  };

  ratio(): number {
    const { width, height } = this.grid;
    return width / height;
  }

  render(tiles = this.grid.tiles): void {
    const { ctx } = this;
    const { width: size } = this.tileSize();

    tiles.forEach((tile) => {
      const { direction } = tile;
      const { x, y, cx, cy } = this.tilePosition(tile);

      ctx.save();

      this.drawTileOutline(tile, x, y, size, size, 0);
      ctx.clip();

      this.clearTile(tile, x, y, size, size);

      if (this.highlighted.has(tile)) {
        this.renderHighlight(tile, x, y, size, size);
      }

      if (!tile.solved) {
        this.renderOutline(tile, x, y, size, size);
      }

      ctx.translate(cx, cy);
      ctx.rotate(rad(90 * direction));
      ctx.translate(-cx, -cy);

      this.renderTile(tile, x, y, size, size);

      ctx.restore();
    });
  }

  clearTile(tile: Tile, x: number, y: number, width: number, height: number) {
    this.ctx.clearRect(x, y, width, height);
  }

  tileSize(): { width: number; height: number } {
    const { ctx, grid } = this;
    const size = ctx.canvas.width / grid.width;

    return { height: size, width: size };
  }

  tilePosition(tile: Tile) {
    const { width: size } = this.tileSize();
    const { x, y } = tile;
    const rectX = size * x;
    const rectY = size * y;
    const cx = rectX + size / 2;
    const cy = rectY + size / 2;

    return {
      x: rectX,
      y: rectY,
      cx,
      cy,
      shapeCx: cx,
      shapeCy: cy,
    };
  }

  drawTileOutline(
    tile: Tile,
    x: number,
    y: number,
    width: number,
    height: number,
    inset: number
  ) {
    const ctx = this.ctx;
    inset /= 2;
    ctx.beginPath();
    ctx.moveTo(x + inset, y + inset);
    ctx.lineTo(x + width - inset, y + inset);
    ctx.lineTo(x + width - inset, y + height - inset);
    ctx.lineTo(x + inset, y + height - inset);
    ctx.closePath();
  }
}
