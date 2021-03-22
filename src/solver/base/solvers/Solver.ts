import {Board} from "../Board";
import {Tile} from "../Tile";

export abstract class Solver {
    constructor(protected board: Board) {
    }

    abstract solveTile(tile: Tile): boolean;
}