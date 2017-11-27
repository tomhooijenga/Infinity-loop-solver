function Turn() {
    Tile.apply(this, arguments);
}

Turn.prototype = Object.create(Tile.prototype);
Turn.prototype.constructor = Turn;

Turn.prototype.sides = [direction.up, direction.right];