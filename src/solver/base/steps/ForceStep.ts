import {SolveStep} from "../SolveStep";
import {Tile} from "../../../base/Tile";
import {Grid} from "../../hex/Grid";
import {DirectionUtil} from "../../../base/DirectionUtil";

export class ForceStep extends SolveStep {

    /**
     * The neighbours are computed once, reducing calls from (sides^length) to (length).
     */
    protected neighbours = new Map<Tile, Tile[]>()

    public solveGrid(tiles: Tile[], grid: Grid): boolean {
        const unsolved = tiles.filter(({solved}) => !solved);
        const combinations = Math.pow(DirectionUtil.NUM_SIDES, unsolved.length);

        if (combinations === 0) {
            return true;
        }

        unsolved.forEach((tile) => {
            tile.rotate(0);

            this.neighbours.set(tile, grid.neighbours(tile));
        });

        for (let i = 0; i < combinations; i++) {
            const done = unsolved.every(this.tileFits, this);

            if (done) {
                unsolved.forEach((tile) => {
                    tile.solved = true;
                });

                return true;
            }

            this.rotate(unsolved);
        }

        return false;
    }

    protected rotate(unsolved: Tile[]): void {
        for (let i = 0; i < unsolved.length; i++) {
            const last = unsolved[i].direction;
            const next = DirectionUtil.rotate(last, 1);

            unsolved[i].direction = next;

            // If it wrapped around we need to rotate the next tile as well.
            if (last < next) {
                break;
            }
        }
    }

    protected tileFits(tile: Tile): boolean {
        const neighbours = this.neighbours.get(tile)!;

        for (let direction = 0; direction < DirectionUtil.NUM_SIDES; direction++) {
            const neighbour = neighbours[direction];
            const opposite = DirectionUtil.opposite(direction);

            if (tile.getSide(direction) !== neighbour.getSide(opposite)) {
                return false;
            }
        }

        return true;
    }
}