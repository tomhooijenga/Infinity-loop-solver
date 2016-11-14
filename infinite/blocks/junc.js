function Junction() {
    Block.apply(this, arguments);
}

Junction.prototype = Object.create(Block.prototype);
Junction.prototype.constructor = Junction;

Junction.prototype.sides = [direction.up, direction.right, direction.down];