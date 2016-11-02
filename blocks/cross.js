function Cross() {
    Block.apply(this, arguments);

    // Cross has 4 equal sides
    this.fixed = true;
}

Cross.prototype = Object.create(Block.prototype);
Cross.prototype.constructor = Cross;

Cross.prototype.sides = [direction.up, direction.right, direction.down, direction.left];

Cross.prototype.best = function () {
    // This line is intentionally left blank
};