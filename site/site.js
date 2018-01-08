var boards = [{
    width: 6,
    height: 4,
    tiles: [None, Turn, Turn, Turn, Turn, None, Turn, Turn, Turn, Turn, Turn, Turn, Turn, Turn, Turn, Turn, Turn, Turn, None, Turn, Turn, Turn, Turn, None]
}, {
    width: 8,
    height: 8,
    tiles: [None, Turn, Line, End, End, Line, Turn, None, End, Turn, End, Turn, Turn, End, Turn, End, Turn, Line, Junction, Cross, Cross, Junction, Line, Turn, Line, End, Cross, Junction, Junction, Cross, End, Line, Junction, End, Junction, Cross, Cross, Junction, End, Junction, Line, Turn, Turn, Junction, Junction, Turn, Turn, Line, Turn, Cross, Turn, End, End, Turn, Cross, Turn, None, End, End, End, End, End, End, None]
}, {
    width: 5,
    height: 8,
    tiles: [End, None, Turn, Junction, Turn, Junction, Line, Turn, Junction, Turn, Turn, End, End, Junction, End, None, End, End, Turn, Junction, Turn, End, End, Turn, Junction, Line, Turn, Junction, Junction, Line, Junction, Junction, Turn, Turn, Line, Turn, Turn, Turn, Line, Turn]
}, {
    width: 4,
    height: 8,
    tiles: [End, Turn, Line, Turn, Junction, Turn, End, Junction, Turn, Junction, Turn, End, End, Junction, Junction, Turn, Turn, Turn, End, End, Turn, Cross, Cross, Turn, Turn, Cross, Turn, End, End, Turn, Line, End]
}, {
    width: 6,
    height: 9,
    tiles: [None, None, End, Line, Turn, None, End, Turn, Junction, Line, Cross, Turn, End, Line, Junction, Line, Junction, Line, Turn, Cross, Turn, End, Turn, Junction, Junction, Cross, End, Line, Turn, Junction, Turn, Cross, Junction, Junction, Junction, Turn, Turn, Cross, Junction, Turn, Line, End, Junction, Turn, Turn, Junction, Turn, End, Turn, Line, End, Turn, Turn, None]
}];

var emptyBoard = {
    width: 3,
    height: 3,
    tiles: [None, None, None, None, None, None, None, None, None]
};

var types = [None, End, Line, Turn, Junction, Cross];

var worker = new Worker('site/worker.js');

var generator = new Generator();

app = new Vue({
    el: '#app',
    data: {
        board: null,
        boards: boards,
        modal: null,
        solving: false,
        custom: {
            width: 5,
            height: 8,
            options: {
                ratio: 70,
                symmetric: {
                    x: false,
                    y: false
                }
            }
        }
    },
    created: function () {
        this.load(0);

        worker.onmessage = function (event) {
            var method = event.data[0],
                data = event.data.slice(1);

            this[method].apply(null, data);
        }.bind(this);
    },
    methods: {
        toggle: function (name, show) {
            if (show === false) {
                this.modal = null;
            } else {
                this.modal = name === this.modal ? null : name;
            }
        },
        generate: function () {
            this.toggle('custom');

            var board =  generator.generate(this.custom.width, this.custom.height, this.custom.options);

            board.tiles.forEach(function (tile) {
                tile.fixed = false;
                tile.setDirection(direction.up);
            });

            this.board = board;
        },
        solve: function (event) {
            if (event.target.disabled) {
                return;
            }

            this.solving = true;

            worker.postMessage(['solve', this.board]);
        },
        done: function(board) {
            this.solving = false;

            board.tiles = board.tiles.map(function (tile) {
                return TileFactory.create(tile.type, tile);
            });

            this.board = board;
        },
        type: function(tile) {
            return tile.name.toLowerCase();
        },
        load: function (index) {
            var board = this.boards[index];

            this.board = Object.assign(
                {},
                board,
                {
                    tiles: board.tiles.map(function (type) {
                        return new type();
                    })
                }
            );

            this.toggle('boards', false);
        },
        clear: function () {
            this.board = Object.assign(
                {},
                emptyBoard,
                {
                    tiles: emptyBoard.tiles.map(function (type) {
                        return new type();
                    })
                }
            );

            this.toggle('boards', false);
        },
        change: function (type, tile) {
            var index = types.indexOf(type.constructor);
            index = (index + 1) % types.length;

            Vue.set(this.board.tiles, tile, new types[index]);
        }
    }
});