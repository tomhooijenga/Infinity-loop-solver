import {SolveStep} from "../SolveStep";
import {Tile} from "../../../base/Tile";
import {Grid} from "../../../base/Grid";
import {None} from "../../../base/None";

export class NoneStep extends SolveStep {
    public solveTile(tile: Tile, grid: Grid): boolean {
        return tile instanceof None;
    }
}