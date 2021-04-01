import {Tile} from "./Tile";
import {Solver} from "./solvers/Solver";
import {IsFacing} from "./IsFacing";
import {DirectionUtil} from "./DirectionUtil";
import {NONE} from "./None";

export abstract class Board {

    public tiles: Tile[] = [];
    public grid: Tile[][] = [];

    constructor(tiles: Tile[] = []) {
        this.setTiles(tiles)
    }

    /**
     * Attempt to solve the board with the given solvers. Solvers are called with each tile until no progress is made.
     */
    public solve(solvers: Solver[]): boolean {
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

            if (solved === this.tiles.length) {
                return true;
            }
        }

        return solvers.some((solver) => solver.solveBoard(this.tiles));
    }

    /**
     * Get the neighbours of the tile.
     */
    public abstract neighbours(tile: Tile): Tile[];

    /**
     * Get the IsFacing state for each side.
     */
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

    /**
     * Get a the tile for the given coordinates, or the NONE when there is no tile.
     */
    protected getOrNone(x: number, y: number): Tile {
        return this.grid[x]?.[y] || NONE;
    }

    /**
     * Set new tiles and grid.
     */
    public setTiles(tiles: Tile[]): void {
        this.tiles = tiles;
        this.grid = this.toGrid(tiles);
    }

    /**
     * Replace a tile on the board.
     */
    public replaceTile(old: Tile, tile: Tile) {
        const {x, y} = old;
        const width = this.grid.length;
        const index = y * width + x;

        this.grid[x][y] = tile;
        this.tiles[index] = tile;
    }

    /**
     * Convert an array of tiles to a grid (nested array).
     */
    protected toGrid(tiles: Tile[]): Tile[][] {
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
}