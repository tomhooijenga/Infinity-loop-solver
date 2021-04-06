import {DirectionUtil} from "./DirectionUtil";

export interface TileParams {
    x?: number;
    y?: number;
    direction?: number;
    solved?: boolean;
}

export type TileConstructor = typeof Tile;

export class Tile {
    public x: number;
    public y: number;
    public direction: number;
    public solved: boolean;

    public get type(): string {
        return this.constructor.name;
    }

    static SIDES: boolean[] = []

    constructor(params: TileParams = {}) {
        this.x = params.x ?? 0;
        this.y = params.y ?? 0;
        this.direction = params.direction ?? 0;
        this.solved = params.solved ?? false;
    }

    public rotate(to: number) {
        this.direction = to;
    }

    public getSide(direction: number): boolean {
        return (this.constructor as TileConstructor).SIDES[DirectionUtil.rotate(direction, -this.direction)];
    }

    public static fromSides(sides: boolean[], type = "unknown"): TileConstructor {
        return class extends this {
            static SIDES = sides;

            public get type(): string {
                return type;
            }
        };
    }
}