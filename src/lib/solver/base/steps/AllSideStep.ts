import { SolveStep } from "../SolveStep";
import { Tile, TileConstructor } from "@/lib/base/Tile";

export class AllSideStep extends SolveStep {
  public solveTile(tile: Tile): boolean {
    const sides = (tile.constructor as TileConstructor).SIDES;
    return sides.filter(Boolean).length === sides.length;
  }
}
