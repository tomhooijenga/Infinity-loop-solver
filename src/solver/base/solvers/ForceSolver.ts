import {Solver} from "./Solver";
import {Tile} from "../Tile";
import {DirectionUtil} from "../DirectionUtil";

export class ForceSolver extends Solver {

    /**
     * The neighbours are computed once, reducing calls from (sides^length) to (length).
     */
    neighbours = new Map<Tile, Tile[]>()

    solveBoard(tiles: Tile[]): boolean {
        const unsolved = tiles.filter(({solved}) => !solved);
        const combinations = Math.pow(DirectionUtil.NUM_SIDES, unsolved.length);

        unsolved.forEach((tile) => {
            tile.rotate(0);

            this.neighbours.set(tile, this.board.neighbours(tile));
        });

        for (let i = 0; i < combinations; i++) {
            const done = unsolved.every(this.tileFits, this);

            if (done) {
                unsolved.forEach((tile) => {
                    tile.solved = true;
                });

                return true;
            }

            this.rotate(unsolved, i);
        }

        return false;
    }

    protected rotate(unsolved: Tile[], combination: number): void {
        const positions = combination.toString(DirectionUtil.NUM_SIDES);

        for (let j = 0; j < positions.length; j++) {
            unsolved[j].rotate(+positions[j]);
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