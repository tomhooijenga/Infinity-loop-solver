import {Board as BaseBoard} from "../base/Board";
import {Tile} from "../base/Tile";
import {None} from "./tiles";
import {DirectionUtil} from "../base/DirectionUtil";
import {IsFacing} from "../base/IsFacing";

const NONE = Object.freeze(new None({solved: true}));

export class Board extends BaseBoard {
    public neighbours(tile: Tile): Tile[] {
        const {x, y} = tile;

        return [
            this.getOrNone(x, y - 1),
            this.getOrNone(x + 1, y),
            this.getOrNone(x, y + 1),
            this.getOrNone(x - 1, y)
        ]
    }

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