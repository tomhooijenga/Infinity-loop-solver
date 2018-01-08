
var TileFactory = {
};

TileFactory.types = {
    cross: Cross,
    end: End,
    junction: Junction,
    line: Line,
    turn: Turn,
    none: None
};

/**
 * Construct a tile from a type
 *
 * @param {string} type The type of tile
 * @param {object} [data] The data to extend the tile with
 * @returns {Tile}
 */
TileFactory.create = function(type, data) {
    data = data || {};

    var constructor = TileFactory.types[type];
    var instance = new constructor();

    Object.keys(data).forEach(function (key) {
        var setter = 'set' + key[0].toUpperCase() + key.slice(1);

        if (setter in instance) {
            instance[setter](data[key]);
        } else {
            instance[key] = data[key];
        }
    });

    return instance;
};