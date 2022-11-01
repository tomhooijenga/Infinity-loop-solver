import { GridRenderer, TileRenderer } from "@/canvas";
import { arc, rad } from "@/canvas/util";

export class SquareGridRenderer extends GridRenderer {
  ratio(): number {
    const { width, height } = this.grid;
    return width / height;
  }

  render(): void {
    super.render();

    const { ctx, grid } = this;
    const size = ctx.canvas.width / grid.width;

    grid.tiles.forEach((tile) => {
      const { x, y, direction } = tile;
      const dx = size * x;
      const dy = size * y;

      ctx.save();
      ctx.translate(dx + size / 2, dy + size / 2);
      ctx.rotate(rad(90 * direction));
      ctx.translate((dx + size / 2) * -1, (dy + size / 2) * -1);

      renderers[tile.type](ctx, tile, size, size, dx, dy);

      ctx.restore();
    });
  }
}

const renderers: Record<string, TileRenderer> = {
  None(ctx, tile, size, _, x, y) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = (size / 100) * 2;

    arc(ctx, size, cx, cy, r, 0, 360, false, "fill");
  },
  Cross(ctx, tile, size, _, x, y) {
    const r = size / 2;

    arc(ctx, size, x, y, r, 0, 90);
    arc(ctx, size, x + size, y, r, 90, 90);
    arc(ctx, size, x + size, y + size, r, 180, 90);
    arc(ctx, size, x, y + size, r, 270, 90);
  },
  End(ctx, tile, size, _, x, y) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const percent = size / 100;
    const r = percent * 25;

    arc(ctx, size, cx, cy, r, 0, 360);

    ctx.fillStyle = "darkRed";
    ctx.fillRect(cx - percent * 5, y, percent * 10, size / 2 - r - percent * 4);
    ctx.fillStyle = "red";
    ctx.fillRect(cx - percent * 3, y, percent * 6, size / 2 - r - percent * 2);
  },
  Junction(ctx, tile, size, _, x, y) {
    const r = (size / 100) * 50;

    arc(ctx, size, x + size, y, r, 90, 90);
    arc(ctx, size, x + size, y + size, r, 180, 90);
  },
  Line(ctx, tile, size, _, x, y) {
    const percent = size / 100;

    ctx.fillStyle = "darkRed";
    ctx.fillRect(x + size / 2 - percent * 5, y, percent * 10, size);
    ctx.fillStyle = "red";
    ctx.fillRect(x + size / 2 - percent * 3, y, percent * 6, size);
  },
  Turn(ctx, tile, size, _, x, y) {
    const r = (size / 100) * 50;

    arc(ctx, size, x + size, y, r, 90, 90);
  },
};
