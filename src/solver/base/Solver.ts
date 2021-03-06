import {SolveStep} from "./SolveStep";
import {Grid} from "../../base/Grid";

export class Solver {
    /**
     * Attempt to solve the grid with the given steps. Solvers are called with each tile until no progress is made.
     */
    public solve(grid: Grid, steps: SolveStep[]): boolean {
        for (const progress of this.solveSteps(grid, steps)) {
            if (progress === grid.tiles.length) {
                return true;
            }
        }

        return false;
    }

    public* solveSteps(grid: Grid, steps: SolveStep[]): Generator<number> {
        let lastSolved = -1;
        let solved = 0;

        while (solved > lastSolved) {
            lastSolved = solved;
            solved = yield* this.runTileStep(grid, steps, lastSolved);

            if (solved === grid.tiles.length) {
                return;
            }
        }

        yield* this.runGridStep(grid, steps);
    }

    protected* runTileStep(grid: Grid, steps: SolveStep[], lastSolved: number): Generator<number, number> {
        let solved = lastSolved;

        for (const step of steps) {
            for (const tile of grid.tiles) {
                if (tile.solved) {
                    continue;
                }

                const wasSolved = step.solveTile(tile, grid);

                if (wasSolved) {
                    tile.solved = true;

                    solved++;

                    yield solved;
                }

                if (solved === grid.tiles.length) {
                    return solved;
                }
            }
        }

        return solved;
    }

    protected* runGridStep(grid: Grid, steps: SolveStep[]): Generator<number> {
        for (const step of steps) {
            const solveGrid = step.solveGrid(grid.tiles, grid);

            if (typeof solveGrid === "boolean") {
                if (solveGrid) {
                    yield grid.tiles.length;
                }
                return;
            }

            for (const progress of solveGrid) {
                yield progress;

                if (progress === grid.tiles.length) {
                    return;
                }
            }
        }
    }
}