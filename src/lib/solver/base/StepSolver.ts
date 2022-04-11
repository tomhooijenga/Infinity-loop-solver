import { SolveStep } from "./SolveStep";
import { Grid } from "@/lib/base/Grid";
import { Solver } from "@/lib/solver/base/Solver";
import { SolveProgress } from "@/lib/solver/base/SolveProgress";

export class StepSolver implements Solver {

  public name = '';

  constructor(protected grid: Grid, protected steps: SolveStep[]) {}

  /**
   * Attempt to solve the grid with the given steps. Solvers are called with each tile until no progress is made.
   */
  public *solve(): Generator<SolveProgress, boolean> {
    let lastSolved = -1;
    let solved = 0;

    while (solved > lastSolved) {
      lastSolved = solved;
      solved = yield* this.runTileStep(lastSolved);

      if (solved === this.grid.tiles.length) {
        return true;
      }
    }

    return false;
  }

  protected *runTileStep(lastSolved: number): Generator<SolveProgress, number> {
    let solved = lastSolved;

    for (const step of this.steps) {
      for (const tile of this.grid.tiles) {
        if (tile.solved) {
          continue;
        }

        if (step.solveTile(tile, this.grid)) {
          tile.solved = true;

          solved++;

          yield {
            solver: step.name,
            tiles: [tile],
          };
        }

        if (solved === this.grid.tiles.length) {
          return solved;
        }
      }
    }

    return solved;
  }
}
