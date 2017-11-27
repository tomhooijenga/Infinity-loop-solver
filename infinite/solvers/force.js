var Force = function () {

};

Force.prototype.run = function (tiles) {
    var _tiles,
        done = false,
        tries = 0,
        max = 0;

    _tiles = tiles.filter(function (tile) {
        if (tile && !tile.fixed) {
            tile.direction = direction.up;

            return true;
        }

        return false;
    });
    max = Math.pow(4, _tiles.length);

    do {
        _tiles = this.rotate(_tiles);

        done = _tiles.every(this.fits);

        tries++;
    } while (!done && tries < max);

    return true;
};

Force.prototype.rotate = function (tiles) {
    for (var i = 0; i < tiles.length; i++) {
        var last = tiles[i].direction,
            next = direction.next(last);

        tiles[i].direction = next;

        if (last < next) {
            break;
        }
    }

    return tiles;
};

Force.prototype.fits = function (tile) {
    var neighbours = tile.neighbours;

    return tile.open.every(function (isOpen, dir) {
        if (neighbours[dir] === false) {
            return isOpen === false;
        }

        var opposite = direction.opposite(dir),
            isNeighbourOpen = neighbours[dir].open[opposite];

        return isOpen === isNeighbourOpen;
    });
};