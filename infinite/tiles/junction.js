function Junction() {
    Tile.apply(this, arguments);
}

Junction.prototype = Object.create(Tile.prototype);
Junction.prototype.constructor = Junction;

Junction.prototype.sides = [direction.up, direction.right, direction.down];