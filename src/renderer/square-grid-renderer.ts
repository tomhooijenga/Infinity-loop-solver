import { colors, TilePosition, TileRenderer, TileSize } from "@/renderer";
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

  gridRatio(): number {
    const { width, height } = this.grid;
    return width / height;
  }

  render(tiles = this.grid.tiles): void {
    const { ctx } = this;

    tiles.forEach((tile) => {
      const info = this.tileInfo(tile);
      const { position, highlighted, direction } = info;
      const { shapeCx, shapeCy } = position;
      const rotate = rad(90 * direction);

      ctx.save();

      this.clearTile(tile);

      if (highlighted) {
        this.renderHighlight(tile);
      }

      if (!tile.solved) {
        this.renderOutline(tile);
      }

      ctx.translate(shapeCx, shapeCy);
      ctx.rotate(rotate);
      ctx.translate(-shapeCx, -shapeCy);

      this.renderTile(tile);

      ctx.restore();

      info.direction = tile.direction;
    });
  }

  tileSize(): { width: number; height: number } {
    const { ctx, grid } = this;
    const { width } = ctx.canvas.getBoundingClientRect();
    // const width = ctx.canvas.width;
    const size = width / grid.width;

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

  tileOutline(size: TileSize, position: TilePosition, inset: number) {
    inset /= 2;

    const { width, height } = size;
    const { x, y } = position;

    const path = new Path2D();
    path.moveTo(x + inset, y + inset);
    path.lineTo(x + width - inset, y + inset);
    path.lineTo(x + width - inset, y + height - inset);
    path.lineTo(x + inset, y + height - inset);
    path.closePath();

    return path;
  }
}
