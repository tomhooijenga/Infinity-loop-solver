import {Solver} from "./Solver";
import {Tile, TileConstructor} from "../Tile";
import {Board} from "../Board";
import {IsFacing} from "../IsFacing";
import {DirectionUtil} from "../DirectionUtil";

export class PatternSolver extends Solver {

    protected patterns: IsFacing[][];

    /**
     * This solver is for tiles that can be solved with a pattern, instead of all sides of a type. For example, a line
     * on a square board can be solved while knowing only one open or closed side.
     */
    constructor(board: Board, protected type: TileConstructor, patterns: boolean[][]) {
        super(board);

        this.patterns = patterns.map((pattern) => {
            return pattern.map((open) => open ? IsFacing.Yes : IsFacing.No);
        });
    }

    public solveTile(tile: Tile): boolean {
        if (!(tile instanceof this.type)) {
            return false;
        }

        const facing = this.board.facing(tile);

        return this.patterns.some((pattern) => {
            const start = this.facingContainsPattern(facing, pattern);
            if (start === -1) {
                return false;
            }

            const sidesFacing = this.type.SIDES.map((open) => open ? IsFacing.Yes : IsFacing.No);
            const direction = this.facingContainsPattern(sidesFacing, pattern);
            tile.rotate(DirectionUtil.rotate(start, -direction));

            return true;
        });
    }

    protected facingContainsPattern(source: IsFacing[], target: IsFacing[]): number {
        // Double the facing to allow for patterns that go from last to first.
        source = source.concat(source);

        const first = target[0];
        const max = source.length - target.length;

        // Adapted from Java's String.indexOf
        for (let i = 0; i <= max; i++) {
            /* Look for first character. */
            if (source[i] != first) {
                while (++i <= max && source[i] != first) ;
            }

            /* Found first character, now look at the rest of v2 */
            if (i <= max) {
                let j = i + 1;
                let end = j + target.length - 1;
                for (let k = 1; j < end && source[j] == target[k]; j++, k++) ;

                if (j == end) {
                    return i;
                }
            }
        }
        return -1;
    }
}