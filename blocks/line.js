function Line() {
    Block.apply(this, arguments);
}

Line.prototype = Object.create(Block.prototype);
Line.prototype.constructor = Line;

Line.prototype.sides = [direction.up, direction.down];

Line.prototype.best = function (board) {
    var neighbours = this.neighbours,
        nextdir;

    for (var dir in neighbours) {
        if (!neighbours.hasOwnProperty(dir)) continue;

        var neighbour = neighbours[dir];

        // Empty space
        if (!neighbour) {
            // Turn opposite side
            nextdir = (direction[dir] + 1) % 4;

            break;
        } else if (neighbour.fixed) {
            var opposite = (direction[dir] + 2) % 4;

            // neighbour doesn't have that side
            if (neighbour.relative().indexOf(opposite) !== -1) {
                nextdir = direction[dir];
            } else {
                nextdir = (direction[dir] + 1) % 4;
            }
        }
    }

    if (nextdir !== undefined) {
        this.direction = nextdir;

        this.fixed = true;
    }
};