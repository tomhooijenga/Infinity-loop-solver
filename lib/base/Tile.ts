import {FacingState} from "./FacingState";

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

    static SIDES: ReadonlyArray<FacingState> = []

    constructor(params: TileParams = {}) {
        this.x = params.x ?? 0;
        this.y = params.y ?? 0;
        this.direction = params.direction ?? 0;
        this.solved = params.solved ?? false;
    }

    public static fromSides(sides: boolean[], type: string): TileConstructor {
        return class extends this {
            static SIDES = sides.map((side) => side ? FacingState.Open : FacingState.Closed);

            public get type(): string {
                return type;
            }
        };
    }
}