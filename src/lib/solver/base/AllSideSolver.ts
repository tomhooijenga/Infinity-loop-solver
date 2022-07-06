import { TileConstructor } from "@/lib/base/Tile";
import { Grid } from "@/lib/base/Grid";
import { Solver } from "@/lib/solver/base/Solver";
import { SolveProgress } from "@/lib/solver/base/SolveProgress";

export class AllSideSolver implements Solver {
  public name = "Filled";

  constructor(protected grid: Grid) {}

  *solve(): Generator<SolveProgress, boolean> {
    const tiles = this.grid.tiles.filter((tile) => {
      const sides = (tile.constructor as TileConstructor).SIDES;
      return sides.filter(Boolean).length === sides.length;
    });

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
