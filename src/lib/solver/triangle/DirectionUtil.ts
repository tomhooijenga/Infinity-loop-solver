import { DirectionUtil as BaseDirectionUtil } from "@/lib/base/DirectionUtil";
import { Tile } from "@/lib/base/Tile";
import { Grid } from "@/lib/solver/triangle/Grid";

export class DirectionUtil extends BaseDirectionUtil {
  constructor(protected grid: Grid) {
    super(3);
  }

  public opposite(tile: Tile, dir: number): number {
    return this.grid.isPointyUp(tile)
      ? this.rotate(dir, -1)
      : this.rotate(dir, 1);
  }
}
