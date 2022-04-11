import { SolveStep } from "../SolveStep";
import { FacingState } from "@/lib/base/FacingState";
import { Tile, TileConstructor } from "@/lib/base/Tile";
import { Grid } from "@/lib/base/Grid";

export class PatternStep implements SolveStep {

  public get name() {
    return `Fit (${this.type.TYPE})`
  }

  protected patterns: FacingState[][];

  /**
   * This solver is for tiles that can be solved with a pattern, instead of all sides of a type. For example, a line
   * on a square grid can be solved while knowing only one open or closed side.
   */
  constructor(protected type: TileConstructor, patterns: boolean[][]) {
    this.patterns = patterns.map((pattern) => {
      return pattern.map((open) =>
        open ? FacingState.Open : FacingState.Closed
      );
    });
  }

  public solveTile(tile: Tile, grid: Grid): boolean {
    if (!(tile instanceof this.type)) {
      return false;
    }

    const facing = grid.facing(tile);

    return this.patterns.some((pattern) => {
      const start = this.patternIndex(facing, pattern);
      if (start === -1) {
        return false;
      }

      const direction = this.patternIndex(this.type.SIDES, pattern);
      tile.direction = grid.directionUtil.rotate(start, -direction);

      return true;
    });
  }

  protected patternIndex(
    source: ReadonlyArray<FacingState>,
    pattern: FacingState[]
  ): number {
    // Double the facing to allow for patterns that go from last to first.
    source = source.concat(source);

    const first = pattern[0];
    const max = source.length - pattern.length;

    // Adapted from Java's String.indexOf
    for (let i = 0; i <= max; i++) {
      /* Look for first character. */
      if (source[i] != first) {
        while (++i <= max && source[i] != first);
      }

      /* Found first character, now look at the rest of v2 */
      if (i <= max) {
        let j = i + 1;
        const end = j + pattern.length - 1;
        for (let k = 1; j < end && source[j] == pattern[k]; j++, k++);

        if (j == end) {
          return i;
        }
      }
    }
    return -1;
  }
}
