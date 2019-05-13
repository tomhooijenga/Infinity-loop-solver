var Fit = function () {

};
/**
 * Shortcut functions for parts of the algorithm
 */
Fit.prototype.tiles = {
    junction: {
        /**
         * A junction has one closed side,
         * so try to match it to a closed neighbour
         *
         * @param {Number[]} sides
         * @returns {Boolean}
         */
        fits: function (sides) {
            return sides.some(function (val, side) {
                if (val === false) {
                    this.setDirection(direction.next(side));

                    return true;
                }
            }, this);
        }
    },
    turn: {
        /**
         * The open and closed sides are symmetric,
         * so if a side is open, the opposite side is closed.
         *
         * @param {Number[]} sides
         * @returns {Number[]}
         */
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
        /**
         * A line has only two positions. One side is enough
         * to find a fit.
         *
         * @param {Number[]} sides
         * @returns {Boolean}
         */
        fits: function (sides) {
            return sides.some(function (val, side) {
                this.setDirection(val === false ? direction.next(side) : side);

                return true;
            }, this);
        }
    }
};

/**
 * Run the solver
 *
 * @param {Tile[]} tiles
 * @returns {boolean} True when all tiles were solved
 */
Fit.prototype.run = function (tiles) {
    var last = 0,
        current = 0;

    do {
        last = current;

        current = this._run(tiles);

    } while (current > last && current < tiles.length);

    return current === tiles.length;
};

/**
 * @param {Tile[]} tiles
 * @returns {number} The amount of tiles solved this run
 * @private
 */
Fit.prototype._run = function (tiles) {
    var found = 0;

    tiles.forEach(function (tile) {
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
 * Get the tile's sides that have a neighbour facing it
 *
 * @param tile
 * @returns {boolean[]} Map of direction => boolean
 */
Fit.prototype.available = function (tile) {
    var neighbours = tile.neighbours,
        sides = [];

    if (tile.fixed) {
        return tile.open;
    }

    neighbours.forEach(function (neighbour, dir) {
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

/**
 * Try to find the correct direction of the tile. When found,
 * set it that way.
 *
 * @param {Tile} tile
 * @param {boolean[]} available Map of side => boolean
 * @returns {boolean}
 */
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

    // There are no neighbours to determine a fit
    if (available.length === 0) {
        return false;
    }

    var len = tile.sides.filter(function (side) {
        return side;
    }).length;

    // Try each of the directions until a fit is found
    return direction.values.some(function (_, dir) {
        tile.setDirection(dir);

        var open = 0,
            closed = 0,
            fit;

        fit = available.every(function (isOpen, side) {
            // Match this tile's side to the neighbour's side
            if (isOpen === tile.open[side]) {
                isOpen ? open++ : closed++;

                return true;
            }

            return false;
        });

        // Legit fit?
        return fit && (open === len || closed === 4 - len)
    });
};