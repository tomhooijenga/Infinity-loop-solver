importScripts(
    '../infinite/direction.js',

    '../infinite/tiles/tile.js',
    '../infinite/tiles/cross.js',
    '../infinite/tiles/end.js',
    '../infinite/tiles/junction.js',
    '../infinite/tiles/line.js',
    '../infinite/tiles/none.js',
    '../infinite/tiles/turn.js',
    '../infinite/tiles/tile-factory.js',

    '../infinite/solvers/fit.js',
    '../infinite/solvers/force.js',
    '../infinite/solver.js',
);

var solver = new Solver([
    new Fit(),
    new Force()
]);



var tasks = {
    solve: function (board) {
        // Tiles were converted to normal objects,
        // convert them back to tiles
        board.tiles = board.tiles.map(function (tile) {
            return new TileFactory(tile.type, tile);
        });

        board = solver.run(board);

        postMessage(['done', board]);
    }
};

onmessage = function (event) {
    var task = event.data[0],
        data = event.data.slice(1);

    if (task in tasks) {
        tasks[task].apply(null, data);
    }
};