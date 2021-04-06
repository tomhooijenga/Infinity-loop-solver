import {SolveStep} from "../SolveStep";
import {Tile} from "../../Tile";
import {None} from "../../None";
import {Grid} from "../../Grid";

export class NoneStep extends SolveStep {
    public solveTile(tile: Tile, grid: Grid): boolean {
        return tile instanceof None;
    }
}