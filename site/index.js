var boards = [
    {
        width: 6,
        height: 4,
        board: ["", "turn", "turn", "turn", "turn", "", "turn", "turn", "turn", "turn", "turn", "turn", "turn", "turn", "turn", "turn", "turn", "turn", "", "turn", "turn", "turn", "turn", ""]
    },
    {
        width: 8,
        height: 8,
        board: ["", "turn", "line", "end", "end", "line", "turn", '', "end", "turn", "end", "turn", "turn", "end", "turn", "end", "turn", "line", "junc", "cross", "cross", "junc", "line", "turn", "line", "end", "cross", "junc", "junc", "cross", "end", "line", "junc", "end", "junc", "cross", "cross", "junc", "end", "junc", "line", "turn", "turn", "junc", "junc", "turn", "turn", "line", "turn", "cross", "turn", "end", "end", "turn", "cross", "turn", "", "end", "end", "end", "end", "end", "end", ""]
    },
    {
        width: 5,
        height: 8,
        board: ["end", "", "turn", "junc", "turn", "junc", "line", "turn", "junc", "turn", "turn", "end", "end", "junc", "end", "", "end", "end", "turn", "junc", "turn", "end", "end", "turn", "junc", "line", "turn", "junc", "junc", "line", "junc", "junc", "turn", "turn", "line", "turn", "turn", "turn", "line", "turn"]
    },
    {
        width: 4,
        height: 8,
        board: ["end", "turn", "line", "turn", "junc", "turn", "end", "junc", "turn", "junc", "turn", "end", "end", "junc", "junc", "turn", "turn", "turn", "end", "end", "turn", "cross", "cross", "turn", "turn", "cross", "turn", "end", "end", "turn", "line", "end"]
    },
    {
        width: 6,
        height: 9,
        board: ["", "", "end", "line", "turn", "", "end", "turn", "junc", "line", "cross", "turn", "end", "line", "junc", "line", "junc", "line", "turn", "cross", "turn", "end", "turn", "junc", "junc", "cross", "end", "line", "turn", "junc", "turn", "cross", "junc", "junc", "junc", "turn", "turn", "cross", "junc", "turn", "line", "end", "junc", "turn", "turn", "junc", "turn", "end", "turn", "line", "end", "turn", "turn", ""]
    }
];

var width = document.getElementById('width'),
    height = document.getElementById('height'),
    solve = document.getElementById('solve'),
    reset = document.getElementById('reset'),
    el = document.getElementById('board'),
    menu = document.getElementById('menu'),
    types = ['end', 'turn', 'line', 'junc', 'cross', ''],
    board;

board = new Board(el);
board.setDimensions(width.value, height.value);

width.addEventListener('input', function (e) {
    board.setDimensions(width.value, height.value)
});

height.addEventListener('input', function (e) {
    board.setDimensions(width.value, height.value)
});

solve.addEventListener('click', function (e) {
    var w = parseInt(width.value, 10),
        h = parseInt(height.value, 10),
        parser = new Html(el, w, h),
        blocks, solver;

    blocks = parser.input({
        cross: Cross,
        end: End,
        junc: Junction,
        line: Line,
        turn: Turn
    });

    solver = new Solver(blocks, [
        new Fit(),
        new Force()
    ]);

    board.render(solver.run(), parser.elements);
});

el.addEventListener('click', function (e) {
    if (!e.target.classList.contains('board')) {
        var index = Math.max(types.indexOf(e.target.dataset.type), 0);

        index = (index + 1) % types.length;

        e.target.dataset.type = types[index];
    }
});

el.addEventListener('contextmenu', function (e) {
    e.preventDefault();

    if (!e.target.classList.contains('board')) {
        var index = Math.max(types.indexOf(e.target.dataset.type), 0);

        index--;
        if (index < 0) index = types.length - 1;

        e.target.dataset.type = types[index];
    }
});

menu.addEventListener('click', function (e) {

    var target = e.target;

    while (!target.classList.contains('board')) {
        target = target.parentNode;
    }

    if (target.classList.contains('board')) {

        width.value = target.dataset.width;
        height.value = target.dataset.height;

        board.setDimensions(width.value, height.value);

        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }

        for (var i = 0; i < target.childNodes.length; i++) {
            el.appendChild(target.childNodes[i].cloneNode(false));
        }
    }
});

reset.addEventListener('click', function (e) {
    board.setDimensions(0, 0);

    board.setDimensions(width.value, height.value);
});

boards.forEach(function (b) {
    var div = document.createElement('div');
    div.classList.add('board');
    div.style.width = b.width * 4 + 'rem';
    div.dataset.width = b.width;
    div.dataset.height = b.height;

    b.board.forEach(function (type) {
        var block = document.createElement('div');

        if (type) {
            block.dataset.type = type;
        }

        div.appendChild(block);
    });

    menu.appendChild(div);
});