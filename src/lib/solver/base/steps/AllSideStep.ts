import { SolveStep } from "../SolveStep";
import { Tile, TileConstructor } from "@/lib/base/Tile";
import { Grid } from "@/lib/base/Grid";

export class AllSideStep implements SolveStep {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  solveTile(tile: Tile, grid: Grid): boolean {
    const sides = (tile.constructor as TileConstructor).SIDES;
    return sides.filter(Boolean).length === sides.length;
  }
}
