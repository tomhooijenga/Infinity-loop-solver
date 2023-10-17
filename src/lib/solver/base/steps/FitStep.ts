import { SolveStep } from "../SolveStep";
import { Tile, TileConstructor } from "@/lib/base/Tile";
import { Grid } from "@/lib/base/Grid";
import { FacingState } from "@/lib/base/FacingState";

export class FitStep implements SolveStep {
  public name = "Fit (Generic)";

  public solveTile(tile: Tile, grid: Grid): boolean {
    const neighbours = grid.facing(tile);
    const sides = (tile.constructor as TileConstructor).SIDES;
    const position =
      this.patternIndex(neighbours, sides, FacingState.Open) ??
      this.patternIndex(neighbours, sides, FacingState.Closed);

    if (position === null) {
      return false;
    }

    tile.direction = position;

    return true;
  }

  protected patternIndex(
    source: readonly FacingState[],
    pattern: readonly FacingState[],
    checking: FacingState
  ): number | null {
    const length = source.length;

    source = source.concat(source);

    for (let i = 0; i <= length; i++) {
      let j = 0;
      for (; j < length; j++) {
        if (pattern[j] !== checking) {
          continue;
        }
        if (source[i + j] !== pattern[j]) {
          break;
        }
      }

      if (j === length) {
        return i;
      }
    }

    return null;
  }
}
