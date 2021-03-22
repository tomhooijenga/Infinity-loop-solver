import {Board as BaseBoard} from "../base/Board";
import {Tile} from "../base/Tile";

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
}