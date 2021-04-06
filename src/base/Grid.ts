import {Tile} from "./Tile";
import {IsFacing} from "./IsFacing";
import {DirectionUtil} from "./DirectionUtil";
import {NONE} from "./None";

export abstract class Grid {

    public tiles: Tile[] = [];
    public grid: Tile[][] = [];

    constructor(tiles: Tile[] = []) {
        this.setTiles(tiles);
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
     * Replace a tile on the grid.
     */
    public replaceTile(old: Tile, tile: Tile): void {
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
            grid[x][y] = tile;
        });
        return grid;
    }
}