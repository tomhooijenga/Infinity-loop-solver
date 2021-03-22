export class DirectionUtil {
    public static NUM_SIDES: number;

    public static opposite(dir: number): number {
        return this.rotate(dir, this.NUM_SIDES / 2);
    }

    public static rotate(dir: number, steps: number): number {
        const newDir = (dir + steps) % this.NUM_SIDES;

        if (newDir < 0) {
            return newDir + this.NUM_SIDES;
        }

        return newDir;
    }
}