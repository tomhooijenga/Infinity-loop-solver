var Force = function () {

};

Force.prototype.run = function (blocks) {
    var _blocks,
        done = false,
        tries = 0,
        max = 0;

    _blocks = blocks.filter(function (block) {
        if (block && !block.fixed) {
            block.direction = direction.up;

            return true;
        }

        return false;
    });
    max = Math.pow(4, _blocks.length);

    do {
        _blocks = this.rotate(_blocks);

        done = _blocks.every(this.fits);

        tries++;
    } while (!done && tries < max);

    return true;
};

Force.prototype.rotate = function (blocks) {
    for (var i = 0; i < blocks.length; i++) {
        var last = blocks[i].direction,
            next = direction.next(last);

        blocks[i].direction = next;

        if (last < next) {
            break;
        }
    }

    return blocks;
};

Force.prototype.fits = function (block) {
    var neighbours = block.neighbours;

    return block.open.every(function (isOpen, dir) {
        if (neighbours[dir] === false) {
            return isOpen === false;
        }

        var opposite = direction.opposite(dir),
            isNeighbourOpen = neighbours[dir].open[opposite];

        return isOpen === isNeighbourOpen;
    });
};