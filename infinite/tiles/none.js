function None() {
    Tile.apply(this, arguments);

    // Empty has 0 sides
    this.fixed = true;
}

None.prototype = Object.create(Tile.prototype);
None.prototype.constructor = None;

None.prototype.sides = [];