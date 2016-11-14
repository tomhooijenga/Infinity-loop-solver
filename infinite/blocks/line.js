function Line() {
    Block.apply(this, arguments);
}

Line.prototype = Object.create(Block.prototype);
Line.prototype.constructor = Line;

Line.prototype.sides = [direction.up, direction.down];