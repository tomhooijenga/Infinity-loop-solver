import { SolveStep } from "../SolveStep";
import { Tile } from "@/lib/base/Tile";
import { Grid } from "@/lib/base/Grid";

export class ForceStep extends SolveStep {
  /**
   * The neighbours are computed once, reducing calls from (sides^length) to (length).
   */
  protected neighbours = new Map<Tile, Tile[]>();

  constructor(protected maxClusterSize: number) {
    super();
  }

  public *solveGrid(tiles: Tile[], grid: Grid): Generator<number, boolean> {
    const unsolved = tiles.filter(({ solved }) => !solved);

    if (unsolved.length === 0) {
      return true;
    }

    unsolved.forEach((tile) => {
      tile.direction = 0;

      this.neighbours.set(tile, grid.neighbours(tile));
    });

    let solved = tiles.length - unsolved.length;
    for (const cluster of this.cluster(unsolved, grid)) {
      if (cluster.length > this.maxClusterSize) {
        continue;
      }

      if (this.solveCluster(cluster, grid)) {
        solved += cluster.length;
        yield solved;
      }
    }

    return solved === tiles.length;
  }

  protected cluster(unsolved: Tile[], grid: Grid): Tile[][] {
    const seen = new Set<Tile>();
    const clusters: Tile[][] = [];

    for (const tile of unsolved) {
      if (seen.has(tile)) {
        continue;
      }
      clusters.push(this.addToCluster(tile, grid, seen, []));
    }

    return clusters;
  }

  protected addToCluster(
    tile: Tile,
    grid: Grid,
    seen: Set<Tile>,
    cluster: Tile[]
  ): Tile[] {
    if (seen.has(tile)) {
      return cluster;
    }

    seen.add(tile);
    cluster.push(tile);

    const neighbours = this.neighbours.get(tile);

    if (!neighbours) {
      throw new Error("Invalid tile");
    }

    neighbours.forEach((neighbour) => {
      if (!neighbour.solved) {
        this.addToCluster(neighbour, grid, seen, cluster);
      }
    });

    return cluster;
  }

  protected solveCluster(cluster: Tile[], grid: Grid): boolean {
    const combinations = Math.pow(grid.directionUtil.numSides, cluster.length);
    const invalid = this.invalid(cluster, grid);

    for (let i = 0; i < combinations; i++) {
      const done = cluster.every((tile) => this.tileFits(grid, tile));

      if (done) {
        cluster.forEach((tile) => {
          tile.solved = true;
        });

        return true;
      }

      this.rotate(grid, cluster, invalid);
    }

    return false;
  }

  protected rotate(grid: Grid, unsolved: Tile[], invalid: Set<string>): void {
    for (let i = 0; i < unsolved.length; i++) {
      const tile = unsolved[i];
      const last = tile.direction;

      do {
        tile.direction = grid.directionUtil.rotate(tile.direction, 1);
      } while (invalid.has(this.makeTileKey(tile)));

      // If it didn't wrap back to 0, we can stop.
      if (last < tile.direction) {
        break;
      }
    }
  }

  protected tileFits(grid: Grid, tile: Tile): boolean {
    const neighbours = this.neighbours.get(tile);

    if (!neighbours) {
      throw new Error("Invalid tile");
    }

    for (const direction of grid.directionUtil) {
      const neighbour = neighbours[direction];
      const opposite = grid.directionUtil.opposite(direction);

      if (
        grid.getTileSide(tile, direction) !==
        grid.getTileSide(neighbour, opposite)
      ) {
        return false;
      }
    }

    return true;
  }

  protected invalid(cluster: Tile[], grid: Grid): Set<string> {
    const set = new Set<string>();

    for (const tile of cluster) {
      const neighbours = this.neighbours.get(tile);

      if (!neighbours) {
        throw new Error("Invalid tile");
      }

      for (const direction of grid.directionUtil) {
        tile.direction = direction;

        for (const direction of grid.directionUtil) {
          const neighbour = neighbours[direction];

          if (!neighbour.solved) {
            continue;
          }

          const opposite = grid.directionUtil.opposite(direction);

          if (
            grid.getTileSide(tile, direction) !==
            grid.getTileSide(neighbour, opposite)
          ) {
            set.add(this.makeTileKey(tile));
            break;
          }
        }
      }
    }

    return set;
  }

  protected makeTileKey(tile: Tile): string {
    const { x, y, direction } = tile;
    return `${x}-${y}-${direction}`;
  }
}
