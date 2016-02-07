var direction = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
};

function Block(element, x, y) {
    this.direction = direction.up;

    this.fixed = false;

    this.element = element;

    this.point = [x, y];

    this.neighbours = null;
}

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

Block.prototype.relative = function () {
    return this.sides.map(function (side) {
        return (side + this.direction) % 4;
    }, this);
};

Block.prototype.count = function () {
    var relative = this.relative(),
        neighbours = this.neighbours,
        count = 0;

    for (var dir in neighbours) {
        if (!neighbours.hasOwnProperty(dir)) continue;

        var neighbour = neighbours[dir];

        if (!neighbour) continue;

        if (relative.indexOf(direction[dir]) !== -1) {

            var next = (direction[dir] + 2) % 4;

            if (neighbour.relative().indexOf(next) !== -1) {
                count++;
            }
        }
    }

    return count;
};