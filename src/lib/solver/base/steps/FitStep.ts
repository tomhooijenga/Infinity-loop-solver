import { SolveStep } from "../SolveStep";
import { Tile, TileConstructor } from "@/lib/base/Tile";
import { Grid } from "@/lib/base/Grid";
import { FacingState } from "@/lib/base/FacingState";

export class FitStep extends SolveStep {
  public solveTile(tile: Tile, grid: Grid): boolean {
    return this.findFit(grid, tile, this.getFacing(tile, grid));
  }

  protected getFacing(tile: Tile, grid: Grid): FacingState[] {
    return grid.facing(tile);
  }

  protected findFit(
    grid: Grid,
    tile: Tile,
    neighbours: FacingState[]
  ): boolean {
    const startDirection = tile.direction;

    for (const direction of grid.directionUtil) {
      tile.direction = direction;

      if (this.fits(grid, tile, neighbours)) {
        return true;
      }
    }

    tile.direction = startDirection;

    return false;
  }

  protected fits(grid: Grid, tile: Tile, neighbours: FacingState[]): boolean {
    let checkedOpen = 0;
    let checkedClosed = 0;

    const openSides = (tile.constructor as TileConstructor).SIDES.filter(
      Boolean
    ).length;

    const couldFit = neighbours.every((facing, side) => {
      if (facing === FacingState.Unknown) {
        return true;
      }

      // Match this tile's side to the neighbour's side
      if (facing === grid.getTileSide(tile, side)) {
        facing ? checkedOpen++ : checkedClosed++;

        return true;
      }

      return false;
    });

    return (
      couldFit &&
      (checkedOpen === openSides ||
        checkedClosed === grid.directionUtil.numSides - openSides)
    );
  }
}
