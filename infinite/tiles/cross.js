function Cross() {
    Tile.call(this);

    // Cross has 4 equal sides
    this.fixed = true;

    this.open = this.sides;
}

Cross.prototype = Object.create(Tile.prototype);
Cross.prototype.constructor = Cross;

Cross.prototype.sides = [true, true, true, true];

Cross.prototype.setDirection = function (newDirection) {
    // No sides to update
};