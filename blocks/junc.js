function Junction() {
    Block.apply(this, arguments);
}

Junction.prototype = Object.create(Block.prototype);
Junction.prototype.constructor = Junction;

Junction.prototype.sides = [direction.up, direction.right, direction.left];

Junction.prototype.best = function (board) {
    var neighbours = this.neighbours,
        nextdir;

    for (var dir in neighbours) {
        if (!neighbours.hasOwnProperty(dir)) continue;

        var neighbour = neighbours[dir];

        // Empty space
        if (!neighbour) {
            nextdir = (direction[dir] + 2) % 4;

            break;
        } else if (neighbour.fixed) {
            // Relative down
            var relativeDown = (direction.down + direction[dir]) % 4;

            // neighbour doesn't have that side
            if (neighbour.relative().indexOf(relativeDown) === -1) {
                nextdir = relativeDown;
            }
        }
    }

    if (nextdir !== undefined) {
        this.direction = nextdir;

        this.fixed = true;
    }
};