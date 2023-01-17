import { Tile, TileConstructor } from "@/lib/base/Tile";
import { GridRenderer } from "@/renderer/grid-renderer";

export class Animation {
  protected clone: Tile;
  protected rafId = 0;
  protected duration = 100;

  constructor(
    protected tile: Tile,
    protected renderer: GridRenderer,
    protected animation: { from: number; to: number }
  ) {
    const TileCtor = tile.constructor as TileConstructor;
    this.clone = new TileCtor(tile);
  }

  start() {
    const {
      clone,
      renderer,
      animation: { from, to },
    } = this;

    if (to === from) {
      return;
    }

    const start = window.performance.now();
    const step = (to - from) / 100;
    const duration = this.duration * Math.abs(to - from);

    const animate: FrameRequestCallback = (timestamp) => {
      const elapsed = timestamp - start;

      clone.direction = from + step * Math.min(elapsed * (100 / duration), 100);

      renderer.render([clone]);

      if (elapsed >= duration) {
        return;
      }

      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }

  stop() {
    cancelAnimationFrame(this.rafId);
  }
}
