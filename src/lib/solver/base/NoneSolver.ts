import { Grid } from "@/lib/base/Grid";
import { Solver } from "@/lib/solver/base/Solver";
import { SolveProgress } from "@/lib/solver/base/SolveProgress";
import { None } from "@/lib/base/None";

export class NoneSolver implements Solver {
  public name = "Empty";

  constructor(protected grid: Grid) {}

  *solve(): Generator<SolveProgress, boolean> {
    const tiles = this.grid.tiles.filter((tile) => tile instanceof None);

    tiles.forEach((tile) => {
      tile.solved = true;
    });

    yield {
      solver: this.name,
      tiles,
    };

    return tiles.length === this.grid.tiles.length;
  }
}
