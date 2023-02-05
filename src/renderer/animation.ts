import { Tile } from "@/lib/base/Tile";
import { GridRenderer } from "@/renderer/grid-renderer";

export class Animation {
  protected rafId = 0;
  protected duration = 100;

  constructor(
    protected tile: Tile,
    protected renderer: GridRenderer,
    protected animation: { from: number; to: number }
  ) {}

  start() {
    const {
      tile,
      renderer,
      animation: { from, to },
    } = this;

    if (to === from) {
      return;
    }

    const info = this.renderer.tileInfo(tile);
    const start = window.performance.now();
    const step = (to - from) / 100;
    const duration = this.duration * Math.abs(to - from);

    const animate: FrameRequestCallback = (timestamp) => {
      const elapsed = timestamp - start;

      info.direction = from + step * Math.min(elapsed * (100 / duration), 100);

      renderer.render([tile]);

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
