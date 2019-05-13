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
 * @type {boolean[]}
 */
Tile.prototype.sides = [];

/**
 * Rotate a tile
 *
 * @param {Number} newDirection
 */
Tile.prototype.setDirection = function(newDirection) {
    this.direction = newDirection;

    this.open[direction.next(direction.up, newDirection)] = this.sides[direction.up];
    this.open[direction.next(direction.right, newDirection)] = this.sides[direction.right];
    this.open[direction.next(direction.down, newDirection)] = this.sides[direction.down];
    this.open[direction.next(direction.left, newDirection)] = this.sides[direction.left];
};