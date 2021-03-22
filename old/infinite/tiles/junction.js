function Junction() {
    Tile.call(this);
}

Junction.prototype = Object.create(Tile.prototype);
Junction.prototype.constructor = Junction;

Junction.prototype.sides = [true, true, true, false];