function Cross() {
    Tile.apply(this, arguments);

    // Cross has 4 equal sides
    this.fixed = true;
}

Cross.prototype = Object.create(Tile.prototype);
Cross.prototype.constructor = Cross;

Cross.prototype.sides = [direction.up, direction.right, direction.down, direction.left];