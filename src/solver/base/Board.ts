import {Tile} from "./Tile";
import {Solver} from "./solvers/Solver";
import {IsFacing} from "./IsFacing";
import {DirectionUtil} from "./DirectionUtil";
import {None} from "./None";

const NONE = Object.freeze(new None({solved: true}));

export abstract class Board {
    public grid: Tile[][];

    constructor(public tiles: Tile[]) {
        this.grid = this.toGrid(tiles);
    }

    toGrid(tiles: Tile[]): Tile[][] {
        const grid: Tile[][] = [];
        tiles.forEach((tile) => {
            const {x, y} = tile;
            if (!(x in grid)) {
                grid[x] = [];
            }
            grid[x][y] = tile
        });
        return grid;
    }

    solve(solvers: Solver[]) {
        let lastSolved = -1;
        let solved = 0;
        while (solved > lastSolved) {
            lastSolved = solved;
            solved = this.tiles.reduce((solved: number, tile: Tile) => {
                if (tile.solved) {
                    return solved + 1;
                }

                const wasSolved = solvers.some((solver) => solver.solveTile(tile))

                if (wasSolved) {
                    tile.solved = true;

                    return solved + 1;
                }

                return solved;
            }, 0)

            console.log(`last: ${lastSolved}, solved: ${solved}`)

            if (solved === this.tiles.length) {
                return true;
            }
        }

        return false;
    }

    public abstract neighbours(tile: Tile): Tile[];

    public facing(tile: Tile): IsFacing[] {
        return this
            .neighbours(tile)
            .map((neighbour, direction) => {
                if (!neighbour.solved) {
                    return IsFacing.Unsure;
                }

                // Tile's up is neighbour's down.
                const opposite = DirectionUtil.opposite(direction);
                return neighbour.getSide(opposite) ? IsFacing.Yes : IsFacing.No;
            });
    }

    protected getOrNone(x: number, y: number): Tile {
        return this.grid[x]?.[y] || NONE;
    }
}