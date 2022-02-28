import { SolveStep } from "@/lib/solver/base/SolveStep";
import { Tile } from "@/lib/base/Tile";
import { None } from "@/lib/base/None";

export class NoneStep implements SolveStep {
  public solveTile(tile: Tile): boolean {
    return tile instanceof None;
  }
}
