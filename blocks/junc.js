function Junction() {
    Block.apply(this, arguments);
}

Junction.prototype = Object.create(Block.prototype);
Junction.prototype.constructor = Junction;

Junction.prototype.sides = [direction.up, direction.right, direction.down];

Junction.prototype.fit = function (sides) {
    for (var side in sides) {
        if (!sides.hasOwnProperty(side)) {
            continue;
        }

        if (sides[side] === false) {
            console.log(this.element, side);

            this.fixed = true;

            this.direction = direction.next(side);

            return true;
        }
    }

    if (!this.fixed) {
        return Block.prototype.fit.call(this, sides);
    }
};