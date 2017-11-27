/**
 * @constructor
 */
function Tile() {
    var _direction;

    Object.defineProperty(this, 'direction', {
        get: function () {
            return _direction;
        },
        set: function (value) {
            _direction = value;

            direction.values.forEach(function (dir) {
                var relative = direction.next(dir, value);

                this.open[relative] = this.sides.indexOf(direction[dir]) !== -1;
            }, this);
        }
    });

    /**
     * Map of side => boolean. True means this side has an
     * opening. Updated when the tile rotates.
     *
     * @type {boolean[]}
     */
    this.open = [];

    /**
     * Map of side => Tile. The direct neighbours of the tile
     *
     * @type {Tile[]}
     */
    this.neighbours = [];

    /**
     * The direction the tile is facing
     *
     * @type {number}
     */
    this.direction = direction.up;

    /**
     * Indicates if this tile has been solved
     *
     * @type {boolean}
     */
    this.fixed = false;

    /**
     * The type of tile
     *
     * @type {string}
     */
    this.type = this.constructor.name.toLowerCase();
}

/**
 * The sides that this tile has. (up, right, left, down)
 *
 * @type {number[]}
 */
Tile.prototype.sides = [];