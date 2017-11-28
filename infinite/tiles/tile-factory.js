/**
 *
 * @param {string} type The type of tile
 * @param {object} [data] The data to extend the tile with
 * @returns {Tile}
 * @constructor
 */
TileFactory = function (type, data) {
    var types = {
        cross: Cross,
        end: End,
        junction: Junction,
        line: Line,
        none: None,
        turn: Turn
    };

    data = data || {};

    var constructor = types[type];
    var instance = new constructor();

    return Object.assign(instance, data);
};