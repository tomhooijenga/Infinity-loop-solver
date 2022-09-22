import { Tile } from "@/lib/base/Tile";

export class DirectionUtil {
  constructor(public numSides: number) {}

  public opposite(tile: Tile, dir: number): number {
    return this.rotate(dir, this.numSides / 2);
  }

  public rotate(dir: number, steps: number): number {
    return (((dir + steps) % this.numSides) + this.numSides) % this.numSides;
  }

  public random(): number {
    return Math.floor(Math.random() * this.numSides);
  }

  public *[Symbol.iterator](): Generator<number, void, void> {
    for (let direction = 0; direction < this.numSides; direction++) {
      yield direction;
    }
  }
}
