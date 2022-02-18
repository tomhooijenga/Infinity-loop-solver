export class DirectionUtil {
  constructor(public numSides: number) {}

  public opposite(dir: number): number {
    return this.rotate(dir, this.numSides / 2);
  }

  public rotate(dir: number, steps: number): number {
    const newDir = (dir + steps) % this.numSides;

    if (newDir < 0) {
      return newDir + this.numSides;
    }

    return newDir;
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
