import {Grid} from "../Grid";
import {Tile} from "../Tile";

export abstract class SolveStep {
    public solveTile(tile: Tile, grid: Grid): boolean {
        return false;
    }

    public solveGrid(tiles: Tile[], grid: Grid): boolean {
        return false;
    }
}