import { Grid as BaseGrid } from "@/lib/base/Grid";
import { Tile } from "@/lib/base/Tile";
import { DirectionUtil } from "./DirectionUtil";

export class Grid extends BaseGrid {
  public directionUtil = new DirectionUtil(this);

  public neighbours(tile: Tile): Tile[] {
    const { x, y } = tile;

    // (0,0) points up.
    if (this.isPointyUp(tile)) {
      // right, down, left
      return [
        this.getOrNone(x + 1, y),
        this.getOrNone(x, y + 1),
        this.getOrNone(x - 1, y),
      ];
    }

    // up, right, down
    return [
      this.getOrNone(x, y - 1),
      this.getOrNone(x + 1, y),
      this.getOrNone(x - 1, y),
    ];
  }

  public isPointyUp(tile: Tile): boolean {
    // (0,0) points up.
    const { x, y } = tile;

    if (y % 2 === 0) {
      return x % 2 === 0;
    }

    return x % 2 === 1;
  }
}
