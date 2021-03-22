import {Solver} from "./Solver";
import {Tile} from "../Tile";
import {None} from "../None";

export class NoneSolver extends Solver {
    solveTile(tile: Tile): boolean {
        return tile instanceof None;
    }
}