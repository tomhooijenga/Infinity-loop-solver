import {Board as BaseBoard} from "../base/Board";
import {Tile} from "../base/Tile";

export class Board extends BaseBoard {
    public neighbours(tile: Tile): Tile[] {
        const {x, y} = tile;

        // start: 1,1
        // 0,0
        // 1,0
        // 2,1
        // 1,2
        // 0,2
        // 0,1
        return [
            [-1, -1],
            [0, 1],
            [1, 0],
            [0, 1],
            [-1, 1],
            [-1, 0]
        ].map(([dx, dy]) => this.getOrNone(x + dx, y + dy));
    }
}