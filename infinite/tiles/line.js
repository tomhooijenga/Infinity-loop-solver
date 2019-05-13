function Line() {
    Tile.call(this);
}

Line.prototype = Object.create(Tile.prototype);
Line.prototype.constructor = Line;

Line.prototype.sides = [true, false, true, false];