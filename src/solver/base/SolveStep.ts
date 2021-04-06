import {Tile} from "../../base/Tile";
import {Grid} from "../../base/Grid";

export abstract class SolveStep {
    public solveTile(tile: Tile, grid: Grid): boolean {
        return false;
    }

    public solveGrid(tiles: Tile[], grid: Grid): boolean {
        return false;
    }
}