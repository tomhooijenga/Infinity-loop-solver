import {Board} from "../solver/base/Board";
import {Tile, TileConstructor} from "../solver/base/Tile";
import {None} from "../solver/base/None";
import {DirectionUtil} from "../solver/base/DirectionUtil";

export class Generator {

    private tileInstances: Map<TileConstructor, Tile>

    constructor(private board: Board, private tileTypes: TileConstructor[]) {
        this.tileInstances = new Map(
            tileTypes.map((type) => [type, new type()])
        );
    }

    public generate(width: number, height: number): Tile[] {
        const amount = width * height;
        const grid = this.grid(width, height);

        for (let i = 0; i < amount; i++) {
            this.add(grid, width, height)
        }

        const tiles = Array
            .from({length: amount})
            .map((_, index) => new None({
                x: index % width,
                y: Math.floor(index / width)
            }));

        this.board.setTiles(tiles)

        return tiles.map((tile) => this.getType(tile, grid));
    }

    protected add(grid: boolean[][], width: number, height: number): void {
        const x = this.random(0, width - 1);
        const y = this.random(0, height - 1);

        grid[x][y] = true;
    }

    protected random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    protected grid(width: number, height: number): boolean[][] {
        return Array.from({length: width}).map(() => {
            return new Array(height).fill(false);
        });
    }

    protected getType(tile: Tile, grid: boolean[][]): Tile {
        if (!grid[tile.x][tile.y]) {
            return new None({
                x: tile.x,
                y: tile.y
            });
        }

        const neighbours = this.board
            .neighbours(tile)
            .map(({x, y}) => {
                return grid[x]?.[y] ?? false;
            });

        const TileConstructor = this.tileTypes.find((tileConstructor) => {
            const tile = this.tileInstances.get(tileConstructor)!;

            for (let direction = 0; direction < DirectionUtil.NUM_SIDES; direction++) {
                tile.rotate(direction);

                const fits = neighbours.every((open, dir) => tile.getSide(dir) === open);

                if (fits) {
                    return true
                }
            }

            return false
        })

        if (TileConstructor) {
            return new TileConstructor({
                x: tile.x,
                y: tile.y
            })
        }

        return new None({
            x: tile.x,
            y: tile.y
        });
    }
}