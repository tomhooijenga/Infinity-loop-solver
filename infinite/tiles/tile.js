/**
 * @constructor
 */
function Tile() {
    /**
     * The direction the tile is facing
     *
     * @type {number}
     */
    this.direction = direction.up;

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

    this.setDirection(direction.up);
}

/**
 * The sides that this tile has. (up, right, left, down)
 *
 * @type {number[]}
 */
Tile.prototype.sides = [];

/**
 * Rotate a tile
 *
 * @param {Number} newDirection
 */
Tile.prototype.setDirection = function(newDirection) {
    this.direction = newDirection;

    direction.values.forEach(function (dir) {
        var relative = direction.next(dir, newDirection);

        this.open[relative] = this.sides.indexOf(direction[dir]) !== -1;
    }, this);
};