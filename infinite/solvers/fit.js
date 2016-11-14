var Fit = function () {

};

Fit.prototype.blocks = {
    junc: {
        fits: function (sides) {
            return sides.some(function (val, side) {
                if (val === false) {
                    this.direction = direction.next(side);

                    return true;
                }
            }, this);
        }
    },
    turn: {
        available: function (sides) {
            var _sides = [];

            sides.forEach(function (val, dir) {
                _sides[dir] = val;
                _sides[direction.opposite(dir)] = !val;
            });

            return _sides;
        }
    },
    line: {
        fits: function (sides) {
            return sides.some(function (val, side) {
                if (val === false) {
                    this.direction = val === false ? direction.next(side) : side;

                    return true;
                }
            }, this);
        }
    }
};

Fit.prototype.run = function (blocks) {
    var last = 0,
        current = 0;

    do {
        last = current;

        current = this._run(blocks);

    } while (current > last);

    return current === blocks.length;
};

Fit.prototype._run = function (blocks) {
    var found = 0;

    blocks.forEach(function (block, index) {
        if (!block) {
            found++;

            return;
        }

        if (block.fixed) {
            found++;

            return;
        }

        var available = this.available(block);

        if (this.fits(block, available)) {
            block.fixed = true;

            found++;
        }
    }, this);

    return found;
};

/**
 * Get the block's available sides
 *
 * @param block
 * @returns {Object}
 */
Fit.prototype.available = function (block) {
    var neighbours = block.neighbours,
        sides = [];

    if (block.fixed) {
        return block.open;
    }

    neighbours.forEach(function (neighbour, dir) {
        if (neighbour === false) {
            sides[dir] = false;

            return;
        }

        // Can't know
        if (!neighbour.fixed) {
            return;
        }

        // My up is his down
        var neighbourRelative = direction.opposite(dir);

        sides[dir] = neighbour.open[neighbourRelative];
    });

    var extension = this.blocks[block.type];

    if (extension && extension.available) {
        sides = extension.available.call(block, sides);
    }

    return sides;
};

Fit.prototype.fits = function (block, available) {
    var extension = this.blocks[block.type];

    if (extension && extension.fits) {
        if (extension.fits.call(block, available)) {
            return true;
        }
    }

    if (block.fixed) {
        return true;
    }

    var len = block.sides.length;

    if (available.length === 0) {
        return false;
    }

    return direction.values.some(function (unused, dir) {
        block.direction = dir;

        var filled = 0,
            empty = 0,
            fit;

        fit = available.every(function (val, side) {
            if (val === block.open[side]) {
                val ? filled++ : empty++;

                return true;
            }

            return false;
        });

        // Legit fit?
        return fit && (filled === len || empty === 4 - len)
    });
};