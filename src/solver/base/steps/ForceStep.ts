import {SolveStep} from "../SolveStep";
import {Tile} from "../../../base/Tile";
import {Grid} from "../../../base/Grid";

export class ForceStep extends SolveStep {

    /**
     * The neighbours are computed once, reducing calls from (sides^length) to (length).
     */
    protected neighbours = new Map<Tile, Tile[]>()

    public solveGrid(tiles: Tile[], grid: Grid): boolean {
        const unsolved = tiles.filter(({solved}) => !solved);
        const combinations = Math.pow(grid.directionUtil.numSides, unsolved.length);

        if (combinations === 0) {
            return true;
        }

        unsolved.forEach((tile) => {
            tile.direction = 0;

            this.neighbours.set(tile, grid.neighbours(tile));
        });

        for (let i = 0; i < combinations; i++) {
            const done = unsolved.every((tile) => this.tileFits(grid, tile));

            if (done) {
                unsolved.forEach((tile) => {
                    tile.solved = true;
                });

                return true;
            }

            this.rotate(grid, unsolved);
        }

        return false;
    }

    protected rotate(grid: Grid, unsolved: Tile[]): void {
        for (let i = 0; i < unsolved.length; i++) {
            const last = unsolved[i].direction;
            const next = grid.directionUtil.rotate(last, 1);

            unsolved[i].direction = next;

            // If it wrapped around we need to rotate the next tile as well.
            if (last < next) {
                break;
            }
        }
    }

    protected tileFits(grid: Grid, tile: Tile): boolean {
        const neighbours = this.neighbours.get(tile)!;

        for (const direction of grid.directionUtil) {
            const neighbour = neighbours[direction];
            const opposite = grid.directionUtil.opposite(direction);

            if (grid.getTileSide(tile, direction) !== grid.getTileSide(neighbour, opposite)) {
                return false;
            }
        }

        return true;
    }
}