import {Board} from "../solver/base/Board";
import {Tile, TileConstructor} from "../solver/base/Tile";
import {None, NONE} from "../solver/base/None";
import {DirectionUtil} from "../solver/base/DirectionUtil";
import {IsFacing} from "../solver/base/IsFacing";

export class Generator {

    protected tileInstances: Map<TileConstructor, Tile>

    constructor(private board: Board, private tileTypes: TileConstructor[]) {
        this.tileInstances = new Map(
            tileTypes.map((type) => [type, new type()])
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

        this.board.setTiles(tiles);

        for (let i = 0; i < amount / 3; i++) {
            this.addLine(tiles, width, height);
        }

        return tiles;
    }

    protected addLine(tiles: Tile[], width: number, height: number): void {
        const x = this.random(0, width - 1);
        const y = this.random(0, height - 1);
        const axis = this.random(0, (DirectionUtil.NUM_SIDES / 2) - 1)
        const length = this.random(2, Math.min(width, height));

        let tile = this.board.grid[x][y];

        for (let i = 0; i < length; i++) {
            const neighbours = this.board.neighbours(tile);
            const facing = this.board.facing(tile);
            const next = i < length - 1 ? neighbours[axis] : NONE;

            if (next !== NONE  && this.isNextOpen(next, axis)) {
                facing[axis] = IsFacing.Yes;
            }

            this.addTile(tile, facing);

            if (next === NONE) {
                break;
            }

            tile = next
        }
    }

    protected addTile(tile: Tile, facing: IsFacing[]) {
        for (const [ctor, t] of this.tileInstances) {
            if (this.tileFits(t, facing)) {
                this.board.replaceTile(tile, new ctor({
                    x: tile.x,
                    y: tile.y,
                    direction: t.direction,
                    solved: true,
                }));
                return;
            }
        }
    }

    protected isNextOpen(next: Tile, axis: number): boolean {
        const facing = this.board.facing(next);

        facing[DirectionUtil.opposite(axis)] = IsFacing.Yes;

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
                return true
            }
        }

        return false;
    }

    protected random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}