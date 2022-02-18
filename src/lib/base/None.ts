import { Tile } from "./Tile";
import { FacingState } from "./FacingState";

export class None extends Tile {
  static SIDES = new Array(100).fill(FacingState.Closed);

  get type(): string {
    return "None";
  }

  getSide(): FacingState.Closed {
    return FacingState.Closed;
  }
}

export const NONE = Object.freeze(
  new None({
    x: Infinity,
    y: Infinity,
    solved: true,
  })
);
