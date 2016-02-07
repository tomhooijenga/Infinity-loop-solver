function Turn() {
    Block.apply(this, arguments);
}

Turn.prototype = Object.create(Block.prototype);
Turn.prototype.constructor = Turn;

Turn.prototype.sides = [direction.up, direction.right];

Turn.prototype.best = function (board) {
    var neighbours = this.neighbours,
        nextdir,
        filtered = {},
        connection = [];

    for (var dir in neighbours) {
        if (!neighbours.hasOwnProperty(dir)) continue;

        var neighbour = neighbours[dir];

        if (!neighbour) {
            connection.push((direction[dir] + 2) % 4);

            continue;
        }

        if (!neighbour.fixed) continue;

        var relative = (direction[dir] + 2) % 4;

        if (neighbour.relative().indexOf(relative) !== -1) {
            connection.push(direction[dir]);
        } else {
            connection.push((direction[dir] + 2) % 4);
        }
    }

    connection = connection.filter(function (val, i) {
        return connection.indexOf(val) === i;
    });

    if (connection.length >= 2) {
        if (connection.indexOf(direction.up) !== -1 && connection.indexOf(direction.left) !== -1) {
            nextdir = direction.left;
        } else {
            nextdir = Math.min.apply(null, connection);
        }
    }

    if (nextdir !== undefined) {
        this.direction = nextdir;

        this.fixed = true;
    }
};