var Solve = function (board, line) {
    this.grid = board;

    this.line = line;
};

Solve.prototype.increase = function () {
    var line = this.line,
        remainder = 0;

    for (var i = line.length - 1; i >= 0; i--) {
        var block = line[i];

        block.direction++;

        if (block.direction >= 4) {
            remainder = block.direction % 4;

            block.direction = 0;
        } else {
            break;
        }
    }
};

Solve.prototype.filter = function () {
    return this.line.filter(function (block) {
        if (!block || !block.fixed) {
            if (!(block instanceof Cross)) {
                return block;
            }
        }
    });
};

Solve.prototype.force = function () {
    var count = this.count.bind(this),
        unknown = this.line.length, possibilities;

    possibilities = Math.pow(4, unknown);

    while (possibilities > 0) {
        if (count() !== unknown) {
            possibilities--;

            this.increase();
        } else {
            break;
        }
    }
};

Solve.prototype.best = function (fixed) {
    var run = 0,
        grid = this.grid;

    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
            var block = grid[x][y];

            if (!block) continue;

            if (!block.fixed) {
                block.fit(block.best());
            }

            if (block.fixed) {
                run++;
            }
        }
    }

    if ((fixed === 0 || run > fixed) && run !== 0) {
        this.best(run);
    }
};

Solve.prototype.count = function () {
    var line = this.line,
        count = 0;

    for (var i = line.length - 1; i >= 0; i--) {
        var block = line[i];

        if (block.count() === block.sides.length) {
            count++;
        }
    }

    return count;
};