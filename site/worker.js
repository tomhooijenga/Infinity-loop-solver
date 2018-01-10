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

    '../infinite/generator.js'
);

[None, End, Line, Turn, Junction, Cross].forEach(function (tile) {
    TileFactory.register(tile.name.toLowerCase(), tile);
});

var solver = new Solver([
    new Fit(),
    new Force()
]);

var generator = new Generator();

var tasks = {
    /**
     * Solve a board
     *
     * @see Solver#solve
     */
    solve: function (board) {
        // Tiles were converted to normal objects,
        // convert them back to tiles
        board.tiles = board.tiles.map(function (tile) {
            return TileFactory.create(tile.type, tile);
        });

        board = solver.run(board);

        postMessage(['solved', board]);
    },
    /**
     * Generate a board
     *
     * @see Generator#generate
     *
     * @param width
     * @param height
     * @param options
     */
    generate: function (width, height, options) {
        var board = generator.generate(width, height, options);

        postMessage(['generated', board]);
    }
};

onmessage = function (event) {
    var task = event.data[0],
        data = event.data.slice(1);

    if (task in tasks) {
        tasks[task].apply(null, data);
    }
};