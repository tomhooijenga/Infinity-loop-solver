import {SolveStep} from "../SolveStep";
import {Tile, TileConstructor} from "../../Tile";
import {Grid} from "../../Grid";

export class AllSideStep extends SolveStep {
    public solveTile(tile: Tile, grid: Grid): boolean {
        const sides = (tile.constructor as TileConstructor).SIDES;
        return sides.filter(Boolean).length === sides.length;
    }
}