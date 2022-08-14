import { Grid as BaseGrid } from "@/lib/base/Grid";
import { Tile } from "@/lib/base/Tile";
import { DirectionUtil } from "@/lib/base/DirectionUtil";

export class Grid extends BaseGrid {
  public directionUtil = new DirectionUtil(3);

  public neighbours(tile: Tile): Tile[] {
    return [];
  }
}
