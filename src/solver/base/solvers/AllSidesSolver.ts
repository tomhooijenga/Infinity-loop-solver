import {Solver} from "./Solver";
import {Tile} from "../Tile";

export class AllSidesSolver extends Solver {
    solveTile(tile: Tile): boolean {
        const sides = (tile.constructor as typeof Tile).SIDES;
        return sides.filter(Boolean).length === sides.length;
    }
}