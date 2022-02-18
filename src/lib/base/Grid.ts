import { Tile, TileConstructor } from "./Tile";
import { FacingState } from "./FacingState";
import { DirectionUtil } from "./DirectionUtil";
import { NONE } from "./None";

export abstract class Grid {
  public tiles: Tile[] = [];
  public grid: Tile[][] = [];

  public abstract directionUtil: DirectionUtil;

  constructor(tiles: Tile[] = []) {
    this.setTiles(tiles);
  }

  /**
   * Get the neighbours of the tile.
   */
  public abstract neighbours(tile: Tile): Tile[];

  /**
   * Get the facing state for each side.
   */
  public facing(tile: Tile): FacingState[] {
    return this.neighbours(tile).map((neighbour, direction) => {
      if (!neighbour.solved) {
        return FacingState.Unknown;
      }

      // Tile's up is neighbour's down.
      const opposite = this.directionUtil.opposite(direction);
      return this.getTileSide(neighbour, opposite);
    });
  }

  /**
   * Get the tile for the given coordinates, or the NONE when there is no tile.
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
    const { x, y } = old;
    const width = this.grid.length;
    const index = y * width + x;

    this.grid[x][y] = tile;
    this.tiles[index] = tile;
  }

  public getTileSide(tile: Tile, direction: number): FacingState {
    const translatedDirection = this.directionUtil.rotate(
      direction,
      -tile.direction
    );
    return (tile.constructor as TileConstructor).SIDES[translatedDirection];
  }

  /**
   * Convert an array of tiles to a grid (nested array).
   */
  protected toGrid(tiles: Tile[]): Tile[][] {
    const grid: Tile[][] = [];
    tiles.forEach((tile) => {
      const { x, y } = tile;
      if (!(x in grid)) {
        grid[x] = [];
      }
      grid[x][y] = tile;
    });
    return grid;
  }
}
