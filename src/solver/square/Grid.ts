import {Grid as BaseGrid} from "../../base/Grid";
import {Tile} from "../../base/Tile";
import {DirectionUtil} from "../../base/DirectionUtil";

export class Grid extends BaseGrid {

    public directionUtil = new DirectionUtil(4);

    public neighbours(tile: Tile): Tile[] {
        const {x, y} = tile;

        return [
            this.getOrNone(x, y - 1),
            this.getOrNone(x + 1, y),
            this.getOrNone(x, y + 1),
            this.getOrNone(x - 1, y)
        ];
    }
}