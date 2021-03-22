import {Tile} from "../../base/Tile";
import {Turn} from "../tiles";
import {FitSolver} from "../../base/solvers/FitSolver";
import {DirectionUtil} from "../../base/DirectionUtil";
import {IsFacing} from "../../base/IsFacing";

export class TurnSolver extends FitSolver {
    solveTile(tile: Tile): boolean {
        if (!(tile instanceof Turn)) {
            return false;
        }

        return super.solveTile(tile);
    }

    /**
     * The opposite side of a turn is always the opposite state: If up is facing, down is not.
     */
    protected getFacing(tile: Tile): IsFacing[] {
        const facing = super.getFacing(tile);

        facing.forEach((isFacing, direction) => {
            if (isFacing === IsFacing.Unsure) {
                return;
            }

            const opposite = DirectionUtil.opposite(direction);

            if (isFacing === IsFacing.Yes) {
                facing[opposite] = IsFacing.No;
            } else if (isFacing === IsFacing.No) {
                facing[opposite] = IsFacing.Yes;
            }
        });

        return facing;
    }
}