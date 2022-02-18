import { Tile } from "@/lib/base/Tile";
import { Grid } from "@/lib/base/Grid";

export abstract class SolveStep {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public solveTile(tile: Tile, grid: Grid): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public solveGrid(tiles: Tile[], grid: Grid): Generator<number> | boolean {
    return false;
  }
}
