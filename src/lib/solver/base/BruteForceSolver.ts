import { Solver } from "@/lib/solver/base/Solver";
import { Grid } from "@/lib/base/Grid";
import { Tile } from "@/lib/base/Tile";

type TileKey = `${number}-${number}-${number}`;

export class BruteForceSolver implements Solver {
  protected neighbours = new Map<Tile, Tile[]>();

  constructor(protected grid: Grid, protected maxClusterSize: number) {}

  *solve(): Generator<number, boolean> {
    const tiles = this.grid.tiles;
    const unsolved = tiles.filter(({ solved }) => !solved);

    if (unsolved.length === 0) {
      return true;
    }

    unsolved.forEach((tile) => {
      tile.direction = 0;

      this.neighbours.set(tile, this.grid.neighbours(tile));
    });

    let solved = tiles.length - unsolved.length;
    for (const cluster of this.cluster(unsolved)) {
      if (this.solveCluster(cluster)) {
        solved += cluster.length;
        yield solved;
      }
    }

    return solved === tiles.length;
  }

  protected cluster(unsolved: Tile[]): Tile[][] {
    const seen = new Set<Tile>();
    const clusters: Tile[][] = [];

    for (const tile of unsolved) {
      if (seen.has(tile)) {
        continue;
      }
      clusters.push(this.addToCluster(tile, seen, []));
    }

    return clusters;
  }

  protected addToCluster(tile: Tile, seen: Set<Tile>, cluster: Tile[]): Tile[] {
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
        this.addToCluster(neighbour, seen, cluster);
      }
    });

    return cluster;
  }

  protected solveCluster(cluster: Tile[]): boolean {
    const invalid = this.invalid(cluster);
    const combinations = this.combinations(cluster, invalid);

    if (
      combinations >
      Math.pow(this.grid.directionUtil.numSides, this.maxClusterSize)
    ) {
      return false;
    }

    for (let i = 0; i < combinations; i++) {
      const done = cluster.every((tile) => this.tileFits(tile));

      if (done) {
        cluster.forEach((tile) => {
          tile.solved = true;
        });

        return true;
      }

      this.rotate(cluster, invalid);
    }

    return false;
  }

  protected rotate(unsolved: Tile[], invalid: Set<string>): void {
    for (let i = 0; i < unsolved.length; i++) {
      const tile = unsolved[i];
      const last = tile.direction;

      do {
        tile.direction = this.grid.directionUtil.rotate(tile.direction, 1);
      } while (invalid.has(this.makeTileKey(tile)));

      // If it didn't wrap back to 0, we can stop.
      if (last < tile.direction) {
        break;
      }
    }
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
        grid.getTileSide(tile, direction) !==
        grid.getTileSide(neighbour, opposite)
      ) {
        return false;
      }
    }

    return true;
  }

  protected invalid(cluster: Tile[]): Set<TileKey> {
    const set = new Set<TileKey>();
    const grid = this.grid;

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

  protected combinations(cluster: Tile[], invalid: Set<TileKey>): number {
    const map = new Map<string, number>();

    for (const key of invalid) {
      const xy = key.replace(/-\d+$/, "");
      const count = map.get(xy) ?? 0;

      map.set(xy, count + 1);
    }

    const numSides = this.grid.directionUtil.numSides;
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
