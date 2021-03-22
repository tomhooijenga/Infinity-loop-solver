function Turn() {
    Tile.call(this);
}

Turn.prototype = Object.create(Tile.prototype);
Turn.prototype.constructor = Turn;

Turn.prototype.sides = [true, true, false, false];