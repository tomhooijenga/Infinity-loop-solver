var Force = function () {

};

/**
 * Run the solver
 *
 * @param {Tile[]} tiles
 * @returns {boolean} True when all tiles were solved
 */
Force.prototype.run = function (tiles) {
    var _tiles,
        max,
        done = false,
        tries = 0;

    // Remove empty and solved tiles
    _tiles = tiles.filter(function (tile) {
        if (tile && !tile.fixed) {
            tile.setDirection(direction.up);

            return true;
        }

        return false;
    });
    // The maximum amount of possibilities
    max = Math.pow(4, _tiles.length);

    do {
        _tiles = this.rotate(_tiles);

        done = _tiles.every(this.fits);

        tries++;
    } while (!done && tries < max);

    return true;
};

/**
 * Rotate the next tile
 *
 * @param tiles
 * @returns {*}
 */
Force.prototype.rotate = function (tiles) {
    for (var i = 0; i < tiles.length; i++) {
        var last = tiles[i].direction,
            next = direction.next(last);

        tiles[i].setDirection(next);

        if (last < next) {
            break;
        }
    }

    return tiles;
};

/**
 * Check if the tile fits
 *
 * @param {Tile} tile
 * @returns {boolean}
 */
Force.prototype.fits = function (tile) {
    var neighbours = tile.neighbours;

    return tile.open.every(function (isOpen, dir) {
        var opposite = direction.opposite(dir),
            isNeighbourOpen = neighbours[dir].open[opposite];

        return isOpen === isNeighbourOpen;
    });
};