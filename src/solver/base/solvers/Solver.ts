import {Board} from "../Board";
import {Tile} from "../Tile";

export abstract class Solver {
    constructor(protected board: Board) {
    }

    public solveTile(tile: Tile): boolean {
        return false;
    }

    public solveBoard(tiles: Tile[]): boolean {
        return false;
    }
}