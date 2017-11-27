/**
 * @param {[]} strategies array of strategies
 * @constructor
 */
var Solver = function (strategies) {
    /**
     * @type {[]}
     */
    this.strategies = strategies;
};

/**
 * Solves a board
 *
 * @returns {{}} The board object
 */
Solver.prototype.run = function (board) {
    var tiles = board.tiles,
        width = board.width;

    board.tiles.map(function (tile) {
        if (tile instanceof None) {
            return false;
        }

        return tile;
    }).forEach(function (tile, index) {

        var notRightEdge = !((index + 1) % width === 0),
            notLeftEdge = !((index) % width  === 0);

        // up, right, down, left
        tile.neighbours = [
            tiles[index - width] || false,
            notRightEdge &&  tiles[index + 1] || false,
            tiles[index + width] || false,
            notLeftEdge && tiles[index - 1] || false
        ];
    });

    this.strategies.some(function (strategy) {
        return strategy.run(tiles);
    }, this);

    return board;
};