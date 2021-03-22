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
 * @param {{width: Number, height: Number, tiles: Tile[]}} board A board object
 * @return {{width: Number, height: Number, tiles: Tile[]}} The board object
 */
Solver.prototype.run = function (board) {
    var tiles = board.tiles,
        width = board.width;

    board.tiles.forEach(function (tile, index) {

        var notRightEdge = !((index + 1) % width === 0),
            notLeftEdge = !((index) % width  === 0);

        // up, right, down, left
        tile.neighbours = [
            tiles[index - width] || new None(),
            notRightEdge &&  tiles[index + 1] || new None(),
            tiles[index + width] || new None(),
            notLeftEdge && tiles[index - 1] || new None()
        ];
    });

    this.strategies.some(function (strategy) {
        return strategy.run(tiles);
    }, this);

    return board;
};