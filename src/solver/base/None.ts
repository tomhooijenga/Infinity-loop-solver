import {Tile} from "./Tile";

export class None extends Tile {
    static SIDES = new Array(100).fill(false);

    getSide(direction: number): boolean {
        return false;
    }
}

export const NONE = Object.freeze(new None({
    x: Infinity,
    y: Infinity,
    solved: true
}));