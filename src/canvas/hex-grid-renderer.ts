// import { GridRenderer } from "@/canvas";
// import { Grid } from "@/lib/base/Grid";
// import { Tile } from "@/lib/base/Tile";
//
// function ratio(grid: Grid) {
//   const tileRatio = 1.1547;
//
//   // Horizontally, each tile shares a "wing"
//   const width = grid.width * 0.75 * tileRatio + 0.25 * tileRatio;
//
//   let height = grid.height;
//
//   // Add half a tile if an odd columns have an even count
//   if ((grid.tiles.length % grid.width) % 2 === 0) {
//     height += 0.5;
//   }
//
//   return width / height;
// }
//
// function render(ctx: CanvasRenderingContext2D, grid: Grid, tile: Tile) {
//   //
// }
//
// export const renderer: GridRenderer = {
//   ratio,
//   render,
// };

import { GridRenderer } from "@/canvas/grid-renderer";
import { TileRenderer } from "@/canvas";
import { Tile } from "@/lib/base/Tile";
import { arc, rad } from "@/canvas/util";

const HEIGHT_RATIO = 1 / (2 / Math.sqrt(3)); // 0.8660

export class HexGridRenderer extends GridRenderer {
  tileRenderers: Record<string, TileRenderer> = {
    None: (ctx, width, height, x, y) => {
      const cx = x + width / 2;
      const cy = y + height / 2;
      const r = (width / 100) * 2;

      arc(ctx, width, cx, cy, r, 0, 360, false, "fill");
    },
    End: (...args) => this.tileRenderers.None(...args),
    TurnS: (...args) => this.tileRenderers.None(...args),
    TurnL: (...args) => this.tileRenderers.None(...args),
    Line: (...args) => this.tileRenderers.None(...args),
    Junction: (...args) => this.tileRenderers.None(...args),
    CheckL: (...args) => this.tileRenderers.None(...args),
    CheckR: (...args) => this.tileRenderers.None(...args),
    Square: (...args) => this.tileRenderers.None(...args),
    Knuckles: (...args) => this.tileRenderers.None(...args),
    Triangle: (...args) => this.tileRenderers.None(...args),
    Diamond: (...args) => this.tileRenderers.None(...args),
    Star: (...args) => this.tileRenderers.None(...args),
  };

  ratio(): number {
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
    let { width, height } = this.grid;

    // Horizontally, each tile shares a "wing"
    width = width * 0.75 + 0.25;

    // Add half a tile if an odd columns have an even count
    if (width > 1) {
      height = height + 0.5;
    }

    return {
      width: ctx.canvas.width / width,
      height: ctx.canvas.height / height,
    };
  }

  render(tiles = this.grid.tiles): void {
    const { ctx, grid } = this;
    const { height, width } = this.tileSize();

    tiles.forEach((tile) => {
      const { x, y, direction } = tile;
      const tileX = width * (x * 0.75);
      const tileY = height * (y + (x % 2 === 1 ? 0.5 : 0));
      const squareCx = tileX + width / 2;
      const squareCy = tileY + height / 2;

      ctx.save();

      // ctx.strokeRect(tileX, tileY, width, height);

      this.drawTileOutline(tile, tileX, tileY, width, height, 0);
      // ctx.strokeStyle = 'green';
      // ctx.stroke();
      ctx.clip();

      this.clearTile(tile, tileX, tileY, width, height);

      if (this.highlighted.has(tile)) {
        this.renderHighlight(tile, tileX, tileY, width, height);
      }

      if (!tile.solved) {
        this.renderOutline(tile, tileX, tileY, width, height);
      }

      ctx.translate(squareCx, squareCy);
      const rotate = rad(60 * direction);

      ctx.rotate(rotate);
      ctx.translate(-squareCx, -squareCy);

      this.renderTile(tile, tileX, tileY, width, height);

      ctx.restore();
    });
  }

  clearTile(tile: Tile, x: number, y: number, width: number, height: number) {
    const ctx = this.ctx;
    ctx.save();
    this.drawTileOutline(tile, x, y, width, height, 0);
    ctx.clip();
    ctx.clearRect(x, y, width, height);
    ctx.restore();
  }

  drawTileOutline(
    tile: Tile,
    x: number,
    y: number,
    width: number,
    height: number,
    inset: number
  ): void {
    const ctx = this.ctx;

    const cx = x + width / 2;
    const cy = y + height / 2;
    const circumRadius = width / 2 - inset / 2;
    const [move, ...angles] = [30, 90, 150, 210, 270, 330];

    ctx.beginPath();
    ctx.moveTo(
      cx + circumRadius * Math.sin(rad(move)),
      cy + circumRadius * Math.cos(rad(move))
    );

    for (const angle of angles) {
      ctx.lineTo(
        cx + circumRadius * Math.sin(rad(angle)),
        cy + circumRadius * Math.cos(rad(angle))
      );
    }
    ctx.closePath();
  }
}
