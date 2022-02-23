import { SolveStep } from "../SolveStep";
import { Tile } from "@/lib/base/Tile";
import { Grid } from "@/lib/base/Grid";

type TileKey = `${number}-${number}-${number}`;

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
    const invalid = this.invalid(cluster, grid);
    const combinations = this.combinations(cluster, grid, invalid);

    if (
      combinations > Math.pow(grid.directionUtil.numSides, this.maxClusterSize)
    ) {
      return false;
    }

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

  protected invalid(cluster: Tile[], grid: Grid): Set<TileKey> {
    const set = new Set<TileKey>();

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

  protected combinations(
    cluster: Tile[],
    grid: Grid,
    invalid: Set<TileKey>
  ): number {
    const map = new Map<string, number>();

    for (const key of invalid) {
      const xy = key.replace(/-\d+$/, "");
      const count = map.get(xy) ?? 0;

      map.set(xy, count + 1);
    }

    const numSides = grid.directionUtil.numSides;
    return [...map.values()]
      .map((invalid) => numSides - invalid)
      .concat(new Array(cluster.length - map.size).fill(numSides))
      .reduce((total, valid) => total * valid);
  }

  protected makeTileKey(tile: Tile): TileKey {
    const { x, y, direction } = tile;
    return `${x}-${y}-${direction}`;
  }
}
