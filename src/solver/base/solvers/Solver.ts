import {Board} from "../Board";
import {Tile} from "../Tile";

export abstract class Solver {
    constructor(protected board: Board) {
    }

    solveTile(tile: Tile): boolean {
        return false;
    }

    solveBoard(tiles: Tile[]): boolean {
        return false;
    }
}