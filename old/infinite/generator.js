/**
 * @constructor
 */
var Generator = function () {
    this.fit = new Fit();
    // Reset 'fit' shortcuts to avoid false positives
    this.fit.tiles = {};
};

/**
 * Generate a new map with tiles
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Object} [options]
 * @param {Number} options.ratio
 * @param {{x: boolean, y: boolean}} options.symmetric
 * @return {{width: Number, height: Number, tiles: Tile[]}}
 */
Generator.prototype.generate = function (width, height, options) {
    options = Object.assign({
        ratio: 70,
        symmetric: {
            x: false,
            y: false
        }
    }, options || {});

    var map = new Array(width * height),
        added = 0;

    for (var i = 0; i < map.length; i++) {
        map[i] = new None();
    }

    do {
        added += this.add(map, width);
    } while (added <= map.length * (options.ratio / 100));

    return {
        width: width,
        height: height,
        tiles: map
    }
};

/**
 * Add a line of tiles
 *
 * @param {Tile[]} map
 * @param {Number} width
 * @return {Number} The amount of tiles that were tried to add
 */
Generator.prototype.add = function (map, width) {
    var isHorizontal = !!this.random(0, 1),
        height = map.length / width,
        added = 0,
        x, y, length, start, end, step;

    if (isHorizontal) {
        // One for index, one for the minimum length
        x = this.random(0, width - 2);
        y = this.random(0, height - 1);
        length = this.random(2, width - x);
        step = 1;
    } else {
        x = this.random(0, width - 1);
        y = this.random(0, height - 2);
        length = this.random(2, height - y);
        step = width;
    }

    start = y * width + x;
    end = start + length * step;

    for (var i = start; i < end; i += step) {
        var neighbours = this.neighbours(map, i, width),
            tile = this.determine(
                map[i],
                neighbours,
                isHorizontal,
                i === end - step
            );

        if (map[i] instanceof None) {
            added++;
        }

        map[i] = tile;
    }

    return added;
};

/**
 * Get the neighbours of a tile
 *
 * @param {Tile[]} map
 * @param {Number} index
 * @param {Number} width
 * @return {Tile[]}
 */
Generator.prototype.neighbours = function (map, index, width) {
    // Check if tile is on left or right edge, otherwise
    // would give false positives
    var notRightEdge = !((index + 1) % width === 0),
        notLeftEdge = !(index % width === 0);

    // up, right, down, left
    return [
        map[index - width] || false,
        notRightEdge && map[index + 1] || false,
        map[index + width] || false,
        notLeftEdge && map[index - 1] || false
    ];
};

/**
 * Determine the tile shape
 *
 * @param {Tile} tile
 * @param {Array.<Tile|boolean>} neighbours
 * @param {boolean} isHorizontal
 * @param {boolean} isLast
 * @return {Tile}
 */
Generator.prototype.determine = function (tile, neighbours, isHorizontal, isLast) {
    var dir = isHorizontal ? direction.right : direction.down;

    var newNeighbours = neighbours.map(function (neighbour) {
        if (neighbour === false) {
            return new None();
        }

        return neighbour;
    });

    for (var type in TileFactory.types) {
        var newTile = TileFactory.create(type, {
                fixed: false,
                neighbours: newNeighbours
            }),
            sides = this.fit.available(newTile);

        // Add the next tile as open, if it is not out of bounds
        if (neighbours[dir] !== false && !isLast) {
            sides[dir] = true;
        }

        if (this.fit.fits(newTile, sides)) {
            newTile.fixed = true;

            return newTile;
        }
    }

    return tile;
};


/**
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
Generator.prototype.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};