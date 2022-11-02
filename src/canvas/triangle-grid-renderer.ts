import { GridRenderer, TileRenderer } from "@/canvas";
import { arc, rad } from "@/canvas/util";
import { Grid } from "@/lib/solver/triangle/Grid";

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

      ctx.fillStyle = "darkRed";
      ctx.fillRect(
        cx - percent * 5,
        cy + r + percent * 3,
        percent * 10,
        incircleR - r - percent * 3
      );
      ctx.fillStyle = "red";
      ctx.fillRect(
        cx - percent * 3,
        cy + r + percent * 2, //  Tiny overlap to prevent edges
        percent * 6,
        incircleR - r - percent * 2
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

  constructor(public grid: Grid, ctx: CanvasRenderingContext2D) {
    super(grid, ctx);
  }

  ratio(): number {
    const { width, height } = this.grid;
    const w = width / 2 + 0.5;
    const h = height * HEIGHT_RATIO;

    return w / h;
  }

  render(): void {
    super.render();

    const { ctx, grid } = this;
    const { height, width } = this.tileSize();

    grid.tiles.forEach((tile) => {
      const { x, y, direction } = tile;
      const tileX = width * (x / 2);
      const tileY = height * y;
      const squareCx = tileX + width / 2;
      const squareCy = tileY + height / 2;

      ctx.save();

      if (!grid.isPointyUp(tile)) {
        ctx.translate(squareCx, squareCy);
        ctx.rotate(rad(180));
        ctx.translate(-squareCx, -squareCy);
      }

      const triangleCx = squareCx;
      const triangleCy = tileY + height * CENTER_OFFSET;

      ctx.translate(triangleCx, triangleCy);
      let rotate = rad(120 * direction);

      if (!grid.isPointyUp(tile)) {
        rotate += rad(120);
      }

      ctx.rotate(rotate);
      ctx.translate(-triangleCx, -triangleCy);

      this.renderTile(tile, tileX, tileY, width, height);

      ctx.restore();
    });
  }

  tileSize(): { width: number; height: number } {
    const { ctx, grid } = this;
    const horizontalTiles = grid.width / 2 + 0.5;
    const width = ctx.canvas.width / horizontalTiles;
    const height = ctx.canvas.height / grid.height;

    return { height, width };
  }
}