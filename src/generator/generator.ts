import {Grid} from "../solver/base/Grid";
import {Tile, TileConstructor} from "../solver/base/Tile";
import {None, NONE} from "../solver/base/None";
import {DirectionUtil} from "../solver/base/DirectionUtil";
import {IsFacing} from "../solver/base/IsFacing";

export class Generator {

    protected tileInstances: Map<TileConstructor, Tile>

    constructor(private grid: Grid, private tileTypes: TileConstructor[]) {
        this.tileInstances = new Map(
            tileTypes.map((TileType) => [TileType, new TileType()])
        );
    }

    public generate(width: number, height: number): Tile[] {
        const amount = width * height;
        const tiles = Array
            .from({length: amount})
            .map((_, index) => new None({
                solved: true,
                x: index % width,
                y: Math.floor(index / width)
            }));

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
            const direction = this.random(0, DirectionUtil.NUM_SIDES - 1);
            const neighbours = this.grid.neighbours(tile);
            const facing = this.grid.facing(tile);
            const next = i < length - 1 ? neighbours[direction] : NONE;

            if (this.isNextOpen(next, direction)) {
                facing[direction] = IsFacing.Yes;

                const added = this.addTile(tile, facing);

                if (!added) {
                    facing[direction] = IsFacing.No;
                    this.addTile(tile, facing);
                    break;
                }
            } else {
                this.addTile(tile, facing)
            }

            if (next === NONE) {
                break;
            }

            tile = next;
        }
    }

    protected addTile(tile: Tile, facing: IsFacing[]): boolean {
        for (const [TileType, t] of this.tileInstances) {
            if (this.tileFits(t, facing)) {
                this.grid.replaceTile(tile, new TileType({
                    x: tile.x,
                    y: tile.y,
                    direction: t.direction,
                    solved: true,
                }));
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

        facing[DirectionUtil.opposite(direction)] = IsFacing.Yes;

        return [...this.tileInstances.values()].some((tile) => this.tileFits(tile, facing));
    }

    protected tileFits(tile: Tile, facing: IsFacing[]): boolean {
        for (let direction = 0; direction < DirectionUtil.NUM_SIDES; direction++) {
            tile.rotate(direction);

            const fits = facing.every((isFacing, side) => {
                const isOpen = isFacing === IsFacing.Yes;
                return isOpen === tile.getSide(side);
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