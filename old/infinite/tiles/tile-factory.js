var TileFactory = {
    /**
     * @var {Object.<string, Tile>}
     */
    types: {},

    /**
     * Register a tile
     *
     * @param {string} name The name of the type
     * @param {Tile} tile A Tile type
     */
    register: function(name, tile) {
        this.types[name] = tile;
    },

    /**
     * Construct a tile from a type
     *
     * @param {string} type The type of tile
     * @param {object} [data] The data to extend the tile with
     * @returns {Tile}
     */
    create: function (type, data) {
        var tileConstructor = TileFactory.types[type];
        var tile = new tileConstructor();

        if (data !== undefined) {
            Object.assign(tile, data);
        }

        return tile;
    }
};
