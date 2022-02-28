import { SolveStep } from "./SolveStep";
import { Grid } from "@/lib/base/Grid";
import { Solver } from "@/lib/solver/base/Solver";

export class StepSolver implements Solver {
  constructor(protected grid: Grid, protected steps: SolveStep[]) {}

  /**
   * Attempt to solve the grid with the given steps. Solvers are called with each tile until no progress is made.
   */
  public *solve(): Generator<number, boolean> {
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

  protected *runTileStep(lastSolved: number): Generator<number, number> {
    let solved = lastSolved;

    for (const step of this.steps) {
      for (const tile of this.grid.tiles) {
        if (tile.solved) {
          continue;
        }

        const wasSolved = step.solveTile(tile, this.grid);

        if (wasSolved) {
          tile.solved = true;

          solved++;

          yield solved;
        }

        if (solved === this.grid.tiles.length) {
          return solved;
        }
      }
    }

    return solved;
  }
}
