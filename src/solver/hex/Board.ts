import {Board as BaseBoard} from "../base/Board";
import {Tile} from "../base/Tile";

export class Board extends BaseBoard {
    public neighbours(tile: Tile): Tile[] {
        const {x, y} = tile;

        // odd column down
        let deltas: [number, number][];

        if (x % 2) {
            // start: 1,1
            deltas = [
                [0, -1],    // 1,0
                [1, 0],     // 2,1
                [1, 1],     // 2,2
                [0, 1],     // 1,2
                [-1, 1],    // 0,2
                [-1, 0],    // 0,1
            ]
        } else {
            // start 2,1
            deltas = [
                [0, -1],    // 2,0
                [1, -1],    // 3,0
                [1, 0],     // 3,1
                [0, 1],     // 2,2
                [-1, 0],    // 1,1
                [-1, -1]    // 1,0
            ]
        }

        return deltas.map(([dx, dy]) => this.getOrNone(x + dx, y + dy));
    }
}