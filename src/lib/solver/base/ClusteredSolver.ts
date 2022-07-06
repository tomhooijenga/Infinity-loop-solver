import { Solver } from "@/lib/solver/base/Solver";
import { Tile } from "@/lib/base/Tile";
import { Grid } from "@/lib/base/Grid";
import { SolveProgress } from "@/lib/solver/base/SolveProgress";

export abstract class ClusteredSolver implements Solver {
  abstract name: string;

  protected neighbours = new Map<Tile, Tile[]>();

  constructor(protected grid: Grid) {}

  *solve(): Generator<SolveProgress, boolean> {
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
      const clusterGen = this.solveCluster(cluster);

      while (true) {
        const { value: solvedCluster, done } = clusterGen.next();

        if (done) {
          if (solvedCluster) {
            solved += cluster.length;

            yield {
              solver: this.name,
              tiles: cluster,
            };
          } else {
            cluster.forEach((tile) => (tile.solved = false));
          }

          break;
        } else {
          yield {
            solver: this.name,
            tiles: [],
          };
        }
      }
    }

    return solved === tiles.length;
  }

  protected abstract solveCluster(cluster: Tile[]): Generator<void, boolean>;

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
}
