import { Tile } from "@/lib/base/Tile";
import { ClusteredSolver } from "@/lib/solver/base/ClusteredSolver";

export class BacktrackingSolver extends ClusteredSolver {
  protected *solveCluster(cluster: Tile[]): Generator<void, boolean> {
    const tile = cluster.find((tile) => !tile.solved);

    if (!tile) {
      return true;
    }

    for (const direction of this.grid.directionUtil) {
      tile.direction = direction;

      if (this.tileFits(tile)) {
        tile.solved = true;

        yield;

        if (yield* this.solveCluster(cluster)) {
          return true;
        }

        tile.direction = 0;
        tile.solved = false;
      }
    }

    return false;
  }

  protected tileFits(tile: Tile): boolean {
    const neighbours = this.neighbours.get(tile);
    const grid = this.grid;

    if (!neighbours) {
      throw new Error("Invalid tile");
    }

    for (const direction of grid.directionUtil) {
      const neighbour = neighbours[direction];
      const opposite = grid.directionUtil.opposite(direction);

      if (
        neighbour.solved &&
        grid.getTileSide(tile, direction) !==
          grid.getTileSide(neighbour, opposite)
      ) {
        return false;
      }
    }

    return true;
  }
}
