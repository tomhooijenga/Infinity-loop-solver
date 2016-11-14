function Turn() {
    Block.apply(this, arguments);
}

Turn.prototype = Object.create(Block.prototype);
Turn.prototype.constructor = Turn;

Turn.prototype.sides = [direction.up, direction.right];