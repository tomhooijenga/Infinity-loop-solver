function Line() {
    Block.apply(this, arguments);
}

Line.prototype = Object.create(Block.prototype);
Line.prototype.constructor = Line;

Line.prototype.sides = [direction.up, direction.down];

Line.prototype.best = function () {
    var sides = Block.prototype.best.apply(this),
        keys = Object.keys(sides),
        next;

    if (keys.length > 0) {
        next = keys[0];

        this.direction = sides[next] ? next : direction.next(next);

        this.fixed = true;
    }

    return sides;
};