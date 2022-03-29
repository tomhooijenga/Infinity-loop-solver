import { Grid as BaseGrid } from "@/lib/base/Grid";
import { Tile } from "@/lib/base/Tile";
import { DirectionUtil } from "@/lib/base/DirectionUtil";

export class Grid extends BaseGrid {
  public directionUtil = new DirectionUtil(4);

  public neighbours(tile: Tile): Tile[] {
    const { x, y } = tile;

    return [
      this.getOrNone(x, y - 1),
      this.getOrNone(x + 1, y),
      this.getOrNone(x, y + 1),
      this.getOrNone(x - 1, y),
    ];
  }
}
