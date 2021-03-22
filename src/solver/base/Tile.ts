import {DirectionUtil} from "./DirectionUtil";

export interface TileParams {
    x?: number;
    y?: number;
    solved?: boolean;
}

export class Tile {
    public x: number = 0;
    public y: number = 0;
    public direction: number = 0
    public solved: boolean = false

    static SIDES: boolean[] = []

    constructor(params: TileParams = {}) {
        this.x = params.x ?? 0;
        this.y = params.y ?? 0;
        this.solved = params.solved ?? false;
    }

    public rotate(to: number) {
        this.direction = to;
    }

    public getSide(direction: number): boolean {
        return (this.constructor as typeof Tile).SIDES[DirectionUtil.rotate(direction, -this.direction)];
    }

    public static fromSides(sides: boolean[], name: string = 'unknown') {
        return class extends this {
            static SIDES = sides;

            name = name;
        }
    }
}