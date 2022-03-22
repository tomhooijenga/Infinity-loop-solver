import { SolveStep } from "@/lib/solver/base/SolveStep";
import { Tile } from "@/lib/base/Tile";
import { None } from "@/lib/base/None";
import { Grid } from "@/lib/base/Grid";

export class NoneStep implements SolveStep {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  solveTile(tile: Tile, grid: Grid): boolean {
    return tile instanceof None;
  }
}
