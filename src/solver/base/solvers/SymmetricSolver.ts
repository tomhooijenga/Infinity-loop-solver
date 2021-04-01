import {Solver} from "./Solver";
import {Tile, TileConstructor} from "../Tile";
import {IsFacing} from "../IsFacing";
import {DirectionUtil} from "../DirectionUtil";
import {Board} from "../Board";

export class SymmetricSolver extends Solver {

    /**
     * This solver is for tiles that can be solved while knowing only one side.
     */
    constructor(board: Board, protected type: TileConstructor, protected checkOpen: boolean, protected checkClosed: boolean) {
        super(board);
    }

    public solveTile(tile: Tile): boolean {
        if (!(tile instanceof this.type)) {
            return false;
        }

        const facing = this.board.facing(tile);

        return [
            this.checkOpen && this.isFacing(tile, facing, IsFacing.Yes),
            this.checkClosed && this.isFacing(tile, facing, IsFacing.No),
        ].some(Boolean);
    }

    protected isFacing(tile: Tile, facing: IsFacing[], facingState: IsFacing): boolean {
        const facingDirection = facing.indexOf(facingState);

        if (facingDirection === -1) {
            return false;
        }

        const direction = this.type.SIDES.indexOf(facingState === IsFacing.Yes);
        tile.rotate(DirectionUtil.rotate(facingDirection, -direction));

        return true;
    }
}