import {SolveStep} from "../SolveStep";
import {Tile, TileConstructor} from "../../../base/Tile";
import {Grid} from "../../hex/Grid";
import {FacingState} from "../../../base/FacingState";
import {DirectionUtil} from "../../../base/DirectionUtil";

export class FitStep extends SolveStep {
    public solveTile(tile: Tile, grid: Grid): boolean {
        return this.findFit(tile, this.getFacing(tile, grid));
    }

    protected getFacing(tile: Tile, grid: Grid): FacingState[] {
        return grid.facing(tile);
    }

    protected findFit(tile: Tile, neighbours: FacingState[]): boolean {
        const startDirection = tile.direction;

        for (let direction = 0; direction < DirectionUtil.NUM_SIDES; direction++) {
            tile.direction = direction;

            if (this.fits(tile, neighbours)) {
                return true;
            }
        }

        tile.direction = startDirection;

        return false;
    }

    protected fits(tile: Tile, neighbours: FacingState[]): boolean {
        let checkedOpen = 0;
        let checkedClosed = 0;

        const openSides = (tile.constructor as TileConstructor).SIDES.filter(Boolean).length;

        const couldFit = neighbours.every((facing, side) => {
            if (facing === FacingState.Unknown) {
                return true;
            }

            // Match this tile's side to the neighbour's side
            if (facing === tile.getSide(side)) {
                facing ? checkedOpen++ : checkedClosed++;

                return true;
            }

            return false;
        });

        return couldFit && (checkedOpen === openSides || checkedClosed === DirectionUtil.NUM_SIDES - openSides);
    }
}