import { colors, TilePosition, TileRenderer, TileSize } from "@/renderer";
import { GridRenderer } from "@/renderer/grid-renderer";
import { arc, rad } from "@/renderer/util";
import { Grid } from "@/lib/solver/triangle/Grid";
import { Tile } from "@/lib/base/Tile";

const HEIGHT_RATIO = 1 / (2 / Math.sqrt(3)); // 0.8660
const CENTER_OFFSET = 1 / 1.5; // 0.6666

export class TriangleGridRenderer extends GridRenderer {
  tileRenderers: Record<string, TileRenderer> = {
    None(ctx, width, height, x, y) {
      const cx = x + width / 2;
      const cy = y + height * CENTER_OFFSET;

      arc(ctx, width, cx, cy, (width / 100) * 2, 0, 360, false, "fill");
    },
    End(ctx, width, height, x, y) {
      const cx = x + width / 2;
      const cy = y + height * CENTER_OFFSET;
      const r = (width / 100) * 15;

      arc(ctx, width, cx, cy, r, 0, 360);

      ctx.translate(cx, cy);
      ctx.rotate(rad(-120));
      ctx.translate(-cx, -cy);

      const percent = width / 100;
      const incircleR = (Math.sqrt(3) / 6) * width;

      ctx.fillStyle = colors.light;
      ctx.fillRect(
        cx - percent * 5,
        cy + r + percent * 3,
        percent * 10,
        incircleR - r - percent * 3,
      );
      ctx.fillStyle = colors.red;
      ctx.fillRect(
        cx - percent * 3,
        cy + r + percent * 2, //  Tiny overlap to prevent edges
        percent * 6,
        incircleR - r - percent * 2,
      );
    },
    Turn(ctx, width, height, x, y) {
      arc(ctx, width, x + width, y + height, width / 2, 180, 60);
    },
    Triangle(ctx, width, height, x, y) {
      arc(ctx, width, x + width, y + height, width / 2, 180, 60);
      arc(ctx, width, x, y + height, width / 2, 300, 60);
      arc(ctx, width, x + width / 2, y, width / 2, 60, 60);
    },
  };

  constructor(
    public grid: Grid,
    ctx: CanvasRenderingContext2D,
  ) {
    super(grid, ctx);
  }

  gridRatio(): number {
    const { width, height } = this.grid;
    const w = width / 2 + 0.5;
    const h = height * HEIGHT_RATIO;

    return w / h;
  }

  render(tiles = this.grid.tiles): void {
    const { ctx, grid } = this;

    tiles.forEach((tile) => {
      const info = this.tileInfo(tile);
      const { position, highlighted, direction } = info;
      const { cx, cy, shapeCx, shapeCy } = position;
      const isPointyUp = grid.isPointyUp(tile);
      const rotate = rad(120 * direction) + (isPointyUp ? 0 : rad(120));

      ctx.save();

      // Flip upside down
      if (!grid.isPointyUp(tile)) {
        ctx.translate(cx, cy);
        ctx.rotate(rad(180));
        ctx.translate(-cx, -cy);
      }

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
    const horizontalTiles = grid.width / 2 + 0.5;
    const { width: canvasWidth, height: canvasHeight } =
      ctx.canvas.getBoundingClientRect();
    const width = canvasWidth / horizontalTiles;
    const height = canvasHeight / grid.height;

    return { height, width };
  }

  tilePosition(tile: Tile) {
    const { width, height } = this.tileSize();
    const { x, y } = tile;
    const rectX = width * (x / 2);
    const rectY = height * y;
    const rectCx = rectX + width / 2;
    const rectCy = rectY + height / 2;
    const triangleCx = rectCx;
    const triangleCy = rectY + height * CENTER_OFFSET;

    return {
      x: rectX,
      y: rectY,
      cx: rectCx,
      cy: rectCy,
      shapeCx: triangleCx,
      shapeCy: triangleCy,
    };
  }

  tileOutline(size: TileSize, position: TilePosition, inset: number) {
    const { height } = size;
    const { shapeCx, shapeCy } = position;
    const circumRadius = (height * 2) / 3 - inset / 2;
    const [move, ...angles] = [60, 180, 300];

    const path = new Path2D();
    path.moveTo(
      shapeCx + circumRadius * Math.sin(rad(move)),
      shapeCy + circumRadius * Math.cos(rad(move)),
    );

    for (const angle of angles) {
      path.lineTo(
        shapeCx + circumRadius * Math.sin(rad(angle)),
        shapeCy + circumRadius * Math.cos(rad(angle)),
      );
    }
    path.closePath();

    return path;
  }
}
