import { Grid } from "@/lib/base/Grid";
import { Tile, TileConstructor } from "@/lib/base/Tile";
import { None, NONE } from "@/lib/base/None";
import { FacingState } from "@/lib/base/FacingState";

export class Generator {
  protected tileInstances: Map<TileConstructor, Tile>;

  constructor(private grid: Grid, private tileTypes: TileConstructor[]) {
    this.tileInstances = new Map(
      tileTypes.map((TileType) => [TileType, new TileType()])
    );
  }

  public generate(width: number, height: number): Tile[] {
    const amount = width * height;
    const tiles = Array.from({ length: amount }).map(
      (_, index) =>
        new None({
          solved: true,
          x: index % width,
          y: Math.floor(index / width),
        })
    );

    this.grid.setTiles(tiles);

    for (let i = 0; i < amount / 4; i++) {
      this.addLine(tiles, width, height);
    }

    return tiles;
  }

  protected addLine(tiles: Tile[], width: number, height: number): void {
    const x = this.random(0, width - 1);
    const y = this.random(0, height - 1);
    const length = this.random(2, 10);

    let tile = this.grid.grid[x][y];

    for (let i = 0; i < length; i++) {
      const direction = this.random(0, this.grid.directionUtil.numSides - 1);
      const neighbours = this.grid.neighbours(tile);
      const facing = this.grid.facing(tile);
      const next = i < length - 1 ? neighbours[direction] : NONE;

      if (this.isNextOpen(next, direction)) {
        facing[direction] = FacingState.Open;

        const added = this.addTile(tile, facing);

        if (!added) {
          facing[direction] = FacingState.Closed;
          this.addTile(tile, facing);
          break;
        }
      } else {
        this.addTile(tile, facing);
      }

      if (next === NONE) {
        break;
      }

      tile = next;
    }
  }

  protected addTile(tile: Tile, facing: FacingState[]): boolean {
    for (const [TileType, t] of this.tileInstances) {
      if (this.tileFits(t, facing)) {
        this.grid.replaceTile(
          tile,
          new TileType({
            x: tile.x,
            y: tile.y,
            direction: t.direction,
            solved: true,
          })
        );
        return true;
      }
    }
    return false;
  }

  protected isNextOpen(next: Tile, direction: number): boolean {
    if (next === NONE) {
      return false;
    }

    const facing = this.grid.facing(next);

    facing[this.grid.directionUtil.opposite(direction)] = FacingState.Open;

    return [...this.tileInstances.values()].some((tile) =>
      this.tileFits(tile, facing)
    );
  }

  protected tileFits(tile: Tile, facing: FacingState[]): boolean {
    for (const direction of this.grid.directionUtil) {
      tile.direction = direction;

      const fits = facing.every((isFacing, side) => {
        return isFacing === this.grid.getTileSide(tile, side);
      });

      if (fits) {
        return true;
      }
    }

    return false;
  }

  protected random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
