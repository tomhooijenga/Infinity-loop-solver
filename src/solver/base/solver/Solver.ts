import {Tile} from "../Tile";
import {Grid} from "../Grid";
import {SolveStep} from "./SolveStep";

export class Solver {
    /**
     * Attempt to solve the grid with the given steps. Solvers are called with each tile until no progress is made.
     */
    public solve(grid: Grid, steps: SolveStep[]): boolean {
        let lastSolved = -1;
        let solved = 0;

        while (solved > lastSolved) {
            lastSolved = solved;
            solved = this.runTileStep(grid, steps);

            if (solved === grid.tiles.length) {
                return true;
            }
        }

        return steps.some((step) => step.solveGrid(grid.tiles, grid));
    }

    protected runTileStep(grid: Grid, solvers: SolveStep[]): number {
        return grid.tiles.reduce((solved: number, tile: Tile) => {
            if (tile.solved) {
                return solved + 1;
            }

            const wasSolved = solvers.some((solver) => solver.solveTile(tile, grid))

            if (wasSolved) {
                tile.solved = true;

                return solved + 1;
            }

            return solved;
        }, 0);
    }
}