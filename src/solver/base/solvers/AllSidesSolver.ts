import {Solver} from "./Solver";
import {Tile, TileConstructor} from "../Tile";

export class AllSidesSolver extends Solver {
    public solveTile(tile: Tile): boolean {
        const sides = (tile.constructor as TileConstructor).SIDES;
        return sides.filter(Boolean).length === sides.length;
    }
}