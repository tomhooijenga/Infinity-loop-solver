function Line() {
    Tile.apply(this, arguments);
}

Line.prototype = Object.create(Tile.prototype);
Line.prototype.constructor = Line;

Line.prototype.sides = [direction.up, direction.down];