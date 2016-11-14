/**
 *
 * @param board Obejct
 * @param strategies Array array of strategies
 * @constructor
 */
var Solver = function (board, strategies) {

    /**
     *
     * @type Object
     */
    this.board = board;

    /**
     * @type Array
     */
    this.strategies = strategies;
};

/**
 * Solves a board
 */
Solver.prototype.run = function () {
    var blocks = this.board.blocks,
        width = this.board.width;

    this.board.blocks.forEach(function (block, index) {

        var notRightEdge = !((index + 1) % width === 0),
            notLeftEdge = !((index) % width  === 0);

        // up, right, left, down
        block.neighbours = [
            blocks[index - width] || false,
            notRightEdge &&  blocks[index + 1] || false,
            blocks[index + width] || false,
            notLeftEdge && blocks[index - 1] || false
        ];
    });

    this.strategies.some(function (strategy) {
        return strategy.run(blocks);
    }, this);

    return this.board;
};