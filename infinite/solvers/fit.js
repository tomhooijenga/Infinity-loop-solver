var Fit = function () {

};

Fit.prototype.tiles = {
    junction: {
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

Fit.prototype.run = function (tiles) {
    var last = 0,
        current = 0;

    do {
        last = current;

        current = this._run(tiles);

    } while (current > last && current < tiles.length);

    return current === tiles.length;
};

Fit.prototype._run = function (tiles) {
    var found = 0;

    tiles.forEach(function (tile, index) {
        if (tile.fixed) {
            found++;

            return;
        }

        var available = this.available(tile);

        if (this.fits(tile, available)) {
            tile.fixed = true;

            found++;
        }
    }, this);

    return found;
};

/**
 * Get the tile's available sides
 *
 * @param tile
 * @returns {Object}
 */
Fit.prototype.available = function (tile) {
    var neighbours = tile.neighbours,
        sides = [];

    if (tile.fixed) {
        return tile.open;
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

    var extension = this.tiles[tile.type];

    if (extension && extension.available) {
        return extension.available.call(tile, sides);
    }

    return sides;
};

Fit.prototype.fits = function (tile, available) {

    if (tile.fixed) {
        return true;
    }

    var extension = this.tiles[tile.type];

    if (extension && extension.fits) {
        if (extension.fits.call(tile, available)) {
            return true;
        }
    }


    var len = tile.sides.length;

    if (available.length === 0) {
        return false;
    }

    return direction.values.some(function (unused, dir) {
        tile.direction = dir;

        var filled = 0,
            empty = 0,
            fit;

        fit = available.every(function (val, side) {
            if (val === tile.open[side]) {
                val ? filled++ : empty++;

                return true;
            }

            return false;
        });

        // Legit fit?
        return fit && (filled === len || empty === 4 - len)
    });
};