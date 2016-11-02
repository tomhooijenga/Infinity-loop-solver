function Turn() {
    Block.apply(this, arguments);
}

Turn.prototype = Object.create(Block.prototype);
Turn.prototype.constructor = Turn;

Turn.prototype.sides = [direction.up, direction.right];

Turn.prototype.best = function () {
    var sides = Block.prototype.best.apply(this),
        keys = Object.keys(sides);

    if (keys.length > 0) {
        keys.forEach(function (dir) {
            var opp = direction.opposite(dir);

            if (sides[opp] === undefined) {
                sides[opp] = !sides[dir];
            }
        });
    }

    return sides;
};