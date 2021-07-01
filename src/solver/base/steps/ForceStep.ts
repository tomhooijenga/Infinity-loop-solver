import {SolveStep} from "../SolveStep";
import {Tile} from "../../../base/Tile";
import {Grid} from "../../../base/Grid";

export class ForceStep extends SolveStep {

    /**
     * The neighbours are computed once, reducing calls from (sides^length) to (length).
     */
    protected neighbours = new Map<Tile, Tile[]>()

    protected invalidDirections = new Map<Tile, Set<number>>();

    constructor(protected maxClusterSize: number) {
        super();
    }

    public * solveGrid(tiles: Tile[], grid: Grid): Generator<number, boolean> {
        const unsolved = tiles.filter(({solved}) => !solved);

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
            clusters.push(
                this.addToCluster(tile, grid, seen, [])
            );
        }

        return clusters;
    }

    protected addToCluster(tile: Tile, grid: Grid, seen: Set<Tile>, cluster: Tile[]): Tile[] {
        if (seen.has(tile)) {
            return cluster;
        }

        seen.add(tile);
        cluster.push(tile);

        this.neighbours.get(tile)!.forEach((neighbour) => {
            if (!neighbour.solved) {
                this.addToCluster(neighbour, grid, seen, cluster);
            }
        });

        return cluster;
    }

    protected solveCluster(cluster: Tile[], grid: Grid): boolean {
        const combinations = Math.pow(grid.directionUtil.numSides, cluster.length);

        for (let i = 0; i < combinations; i++) {
            const done = cluster.every((tile) => this.tileFits(grid, tile));

            if (done) {
                cluster.forEach((tile) => {
                    tile.solved = true;
                });

                return true;
            }

            this.rotate(grid, cluster);
        }

        return false;
    }

    protected rotate(grid: Grid, unsolved: Tile[]): void {
        for (let i = 0; i < unsolved.length; i++) {
            const tile = unsolved[i];
            const last = tile.direction;
            const next = grid.directionUtil.rotate(last, 1);

            tile.direction = next;

            // If it didn't wrap back to 0, we can stop.
            if (last < next) {
                break;
            }
        }
    }

    protected tileFits(grid: Grid, tile: Tile): boolean {
        if (this.isDirectionInvalid(tile)) {
            return false;
        }

        const neighbours = this.neighbours.get(tile)!;

        for (const direction of grid.directionUtil) {
            const neighbour = neighbours[direction];
            const opposite = grid.directionUtil.opposite(direction);

            if (grid.getTileSide(tile, direction) !== grid.getTileSide(neighbour, opposite)) {
                if (neighbour.solved) {
                    this.markDirectionInvalid(tile);
                }

                return false;
            }
        }

        return true;
    }

    protected markDirectionInvalid(tile: Tile): void {
        const directions = this.invalidDirections.get(tile) ?? new Set();
        directions.add(tile.direction);
        this.invalidDirections.set(tile, directions);
    }

    protected isDirectionInvalid(tile: Tile): boolean {
        return this.invalidDirections.get(tile)?.has(tile.direction) ?? false;
    }
}