var direction = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
};

// Non enumerable
Object.defineProperty(direction, 'values', {
    value: Object.keys(direction)
});

Object.defineProperty(direction, 'opposite', {
    value: function (dir) {
        dir = typeof dir === 'number' ? dir : direction[dir];

        return direction.values[(dir + 2) % 4];
    }
});

Object.defineProperty(direction, 'next', {
    value: function (dir, amount) {
        dir = typeof dir === 'number' ? dir : direction[dir];

        if (typeof amount === 'string') {
            amount = this[amount];
        } else if (amount === undefined) {
            amount = 1;
        }

        return direction.values[(dir + amount) % 4];
    }
});

function Block(element, x, y) {

    var _direction;

    Object.defineProperty(this, 'direction', {
        get: function () {
            return _direction;
        },
        set: function (value) {
            _direction = value;

            direction.values.forEach(function (dir) {
                var relative = direction.next(dir, value);

                this.open[relative] = this.sides.indexOf(direction[dir]) !== -1;
            }, this);
        }
    });


    this.open = {};

    this.direction = direction.up;

    this.fixed = false;

    this.element = element;

    this.point = [x, y];

    this.neighbours = null;
}

Block.prototype.sides = [];

Block.prototype._neighbours = function (board) {
    var x = this.point[0],
        y = this.point[1];

    this.neighbours = {
        left: board[x - 1] ? board[x - 1][y] : false,
        right: board[x + 1] ? board[x + 1][y] : false,
        up: board[x][y - 1] ? board[x][y - 1] : false,
        down: board[x][y + 1] ? board[x][y + 1] : false
    }
};

Block.prototype.count = function () {
    // var relative = this.relative,
    //     neighbours = this.neighbours,
    //     count = 0;
    //
    // for (var dir in neighbours) {
    //     if (!neighbours.hasOwnProperty(dir)) continue;
    //
    //     var neighbour = neighbours[dir];
    //
    //     if (!neighbour) continue;
    //
    //     if (relative.indexOf(direction[dir]) !== -1) {
    //
    //         var next = (direction[dir] + 2) % 4;
    //
    //         if (neighbour.relative.indexOf(next) !== -1) {
    //             count++;
    //         }
    //     }
    // }
    //
    // return count;
};

Block.prototype.best = function () {
    var neighbours = this.neighbours,
        sides = {},
        dir;

    if (this.fixed) {
        return this.relative;
    }

    for (dir in neighbours) {
        if (!neighbours.hasOwnProperty(dir)) {
            continue;
        }

        var neighbour = neighbours[dir];

        if (neighbour === false) {
            sides[dir] = false;

            continue;
        }

        // Can't know
        if (!neighbour.fixed) {
            continue;
        }

        // My up is his down
        var neighbourRelative = direction.opposite(dir);

        sides[dir] = neighbour.open[neighbourRelative];
    }

    return sides;
};

Block.prototype.fit = function (sides) {
    if (this.fixed) {
        return true;
    }

    return direction.values.some(function (dir) {
        this.direction = dir;

        var filled = 0,
            empty = 0,
            fit;

        fit = Object.keys(sides).every(function (side) {
            if (sides[side] === this.open[side]) {
                sides[side] ? filled++ : empty++;

                return true;
            }

            return false;
        }, this);

        if (fit && filled === this.sides.length || empty === 4 - this.sides.length) {
            this.fixed = true;
        }

        return fit;
    }, this);
};