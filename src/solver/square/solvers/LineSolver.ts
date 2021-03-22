import {Solver} from "../../base/solvers/Solver";
import {Tile} from "../../base/Tile";
import {Line} from "../tiles";
import {DirectionUtil} from "../../base/DirectionUtil";
import {IsFacing} from "../../base/IsFacing";

export class LineSolver extends Solver {
    /**
     * A line has only two positions, so one known side is enough.
     */
    public solveTile(tile: Tile): boolean {
        if (!(tile instanceof Line)) {
            return false;
        }

        const facing = this.board.facing(tile);

        const openDirection = facing.indexOf(IsFacing.Yes);
        if (openDirection !== -1) {
            tile.rotate(openDirection)
            return true;
        }

        const closeDirection = facing.indexOf(IsFacing.No);
        if (closeDirection !== -1) {
            tile.rotate(DirectionUtil.rotate(closeDirection, 1));
            return true;
        }

        return false;
    }
}