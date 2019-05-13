function None() {
    Tile.call(this);

    // Empty has 0 sides
    this.fixed = true;

    this.open = this.sides;
}

None.prototype = Object.create(Tile.prototype);
None.prototype.constructor = None;

None.prototype.sides = [false, false, false, false];

None.prototype.setDirection = function (newDirection) {
    // No sides to update
};