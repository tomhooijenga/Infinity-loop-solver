import { GridRenderer } from "@/renderer/grid-renderer";
import { colors, TilePosition, TileRenderer, TileSize } from "@/renderer";
import { Tile } from "@/lib/base/Tile";
import { arc, curve, rad } from "@/renderer/util";

const HEIGHT_RATIO = 1 / (2 / Math.sqrt(3)); // 0.8660

export class HexGridRenderer extends GridRenderer {
  tileRenderers: Record<string, TileRenderer> = {
    None: (ctx, width, height, x, y) => {
      const cx = x + width / 2;
      const cy = y + height / 2;
      const r = (width / 100) * 2;

      arc(ctx, width, cx, cy, r, 0, 360, false, "fill");
    },
    End(ctx, width, height, x, y) {
      const cx = x + width / 2;
      const cy = y + height / 2;
      const percent = width / 100;
      const r = percent * 15;

      arc(ctx, width, cx, cy, r, 0, 360);

      ctx.fillStyle = colors.light;
      ctx.fillRect(
        cx - percent * 5,
        y,
        percent * 10,
        height / 2 - r - percent * 4,
      );
      ctx.fillStyle = colors.red;
      ctx.fillRect(
        cx - percent * 3,
        y,
        percent * 6,
        height / 2 - r - percent * 2,
      );
    },
    TurnS(ctx, width) {
      arc(ctx, width, width * 0.75, 0, (width / 100) * 25, 60, 120);
    },
    TurnL(ctx, width, height) {
      curve(ctx, width, height, width * 0.5, 0, width * 0.875, height * 0.75);
    },
    Line(ctx, width, height, x, y) {
      const percent = width / 100;

      ctx.fillStyle = colors.light;
      ctx.fillRect(x + width / 2 - percent * 5, y, percent * 10, height);
      ctx.fillStyle = colors.red;
      ctx.fillRect(x + width / 2 - percent * 3, y, percent * 6, height);
    },
    Junction(ctx, width, height) {
      const r = (width / 100) * 25;

      arc(ctx, width, width * 0.75, 0, r, 60, 120);
      arc(ctx, width, width, height / 2, r, 120, 120);
    },
    CheckL(ctx, width, height) {
      arc(ctx, width, width * 0.75, height, (width / 100) * 25, 180, 120);
      curve(
        ctx,
        width,
        height,
        width * 0.125,
        height * 0.25,
        width * 0.5,
        height,
      );
    },
    CheckR(ctx, width, height) {
      arc(ctx, width, width * 0.25, height, (width / 100) * 25, 240, 120);
      curve(
        ctx,
        width,
        height,
        width * 0.875,
        height * 0.25,
        width * 0.5,
        height,
      );
    },
    Square(ctx, width, height) {
      const r = (width / 100) * 25;

      curve(ctx, width, height, width * 0.5, 0, width * 0.875, height * 0.75);
      arc(ctx, width, width * 0.75, height, r, 180, 120);
      curve(
        ctx,
        width,
        height,
        width * 0.125,
        height * 0.25,
        width * 0.5,
        height,
      );
      arc(ctx, width, width * 0.25, 0, r, 360, 120);
    },
    Knuckles(ctx, width, height) {
      const r = (width / 100) * 25;

      arc(ctx, width, width * 0.75, 0, r, 60, 120);
      arc(ctx, width, width, height / 2, r, 120, 120);
      arc(ctx, width, width * 0.75, height, r, 180, 120);
    },
    Triangle(ctx, width, height) {
      curve(ctx, width, height, width * 0.5, 0, width * 0.875, height * 0.75);
      curve(
        ctx,
        width,
        height,
        width * 0.875,
        height * 0.75,
        width * 0.125,
        height * 0.75,
      );
      curve(ctx, width, height, width * 0.125, height * 0.75, width * 0.5, 0);
    },
    Diamond(ctx, width, height) {
      const r = (width / 100) * 25;

      arc(ctx, width, width * 0.75, 0, r, 60, 120);
      curve(
        ctx,
        width,
        height,
        width * 0.875,
        height * 0.25,
        width * 0.5,
        height,
      );
      curve(
        ctx,
        width,
        height,
        width * 0.125,
        height * 0.25,
        width * 0.5,
        height,
      );
      arc(ctx, width, width * 0.25, 0, r, 360, 120);
    },
    Star(ctx, width, height) {
      const r = (width / 100) * 25;

      arc(ctx, width, width * 0.75, 0, r, 60, 120);
      arc(ctx, width, width * 0.75, height, r, 180, 120);
      arc(ctx, width, 0, height / 2, r, 300, 120);
    },
  };

  gridRatio(): number {
    let { width, height } = this.grid;

    // Horizontally, each tile shares a "wing"
    width = width * 0.75 + 0.25;

    // Add half a tile if an odd columns have an even count
    if (width > 1) {
      height = height + 0.5;
    }

    return width / (height * HEIGHT_RATIO);
  }

  tileSize(): { width: number; height: number } {
    const { ctx } = this;
    const { width: canvasWidth, height: canvasHeight } =
      ctx.canvas.getBoundingClientRect();
    let { width, height } = this.grid;

    // Horizontally, each tile shares a "wing"
    width = width * 0.75 + 0.25;

    // Add half a tile if an odd columns have an even count
    if (width > 1) {
      height = height + 0.5;
    }

    return {
      width: canvasWidth / width,
      height: canvasHeight / height,
    };
  }

  tilePosition(tile: Tile) {
    const { width, height } = this.tileSize();
    const { x, y } = tile;
    const rectX = width * (x * 0.75);
    const rectY = height * (y + (x % 2 === 1 ? 0.5 : 0));
    const cx = rectX + width / 2;
    const cy = rectY + height / 2;

    return {
      x: rectX,
      y: rectY,
      cx,
      cy,
      shapeCx: cx,
      shapeCy: cy,
    };
  }

  render(tiles = this.grid.tiles): void {
    const { ctx } = this;

    tiles.forEach((tile) => {
      const info = this.tileInfo(tile);
      const { position, highlighted, direction } = info;
      const { shapeCx, shapeCy } = position;
      const rotate = rad(60 * direction);

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

  tileOutline(size: TileSize, position: TilePosition, inset: number) {
    const { width, height } = size;
    const { x, y } = position;

    const cx = x + width / 2;
    const cy = y + height / 2;
    const circumRadius = width / 2 - inset / 2;
    const [move, ...angles] = [30, 90, 150, 210, 270, 330];

    const path = new Path2D();
    path.moveTo(
      cx + circumRadius * Math.sin(rad(move)),
      cy + circumRadius * Math.cos(rad(move)),
    );

    for (const angle of angles) {
      path.lineTo(
        cx + circumRadius * Math.sin(rad(angle)),
        cy + circumRadius * Math.cos(rad(angle)),
      );
    }
    path.closePath();

    return path;
  }
}
