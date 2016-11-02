function Board(element) {
    this.types = {
        cross: Cross,
        end: End,
        junc: Junction,
        line: Line,
        turn: Turn
    };

    this.element = element;

    this.width = null;

    this.height = null;

    this.grid = null;
}

Board.prototype.setDimensions = function (width, height) {
    this.element.style.width = width * 4 + 'rem';
    this.element.style.height = height * 4 + 'rem';

    if (width * height < this.element.childElementCount) {
        while (this.element.childElementCount > width * height) {
            this.element.removeChild(this.element.lastElementChild);
        }
    } else {
        while (this.element.childElementCount < width * height) {
            this.element.appendChild(document.createElement('div'));
        }
    }

    this.width = width;
    this.height = height;
};

Board.prototype.solve = function () {
    var solve = new Solve(this.grid, this.line),
        possibilities;

    solve.best(0);

    this.draw();

    solve.line = solve.filter();

    possibilities = Math.pow(4, solve.line.length);

    if (possibilities < 65536 || confirm('There are ' + possibilities + ' possibilities. This might take a while. Continue?')) {
        //solve.force();
    }
};

Board.prototype.parse = function () {
    var types = this.types,
        els = this.element.querySelectorAll('div'),
        width = this.width,
        grid = [],
        line = [];

    // Build grid and block list
    for (var i = 0; i < els.length; i++) {
        var x = i % width,
            y = Math.floor(i / width),
            type = els[i].dataset.type;

        if (grid[x] === undefined) {
            grid[x] = [];
        }

        if (types[type]) {
            var block = new types[type](els[i], x, y);

            grid[x].push(block);
            line.push(block);
        } else {
            grid[x].push(false);
            line.push(false);
        }
    }

    line.forEach(function (block) {
        if (!block) return;

        block._neighbours(grid);
    });

    this.line = line;
    this.grid = grid;
};

Board.prototype.draw = function () {
    var grid = this.grid;

    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
            var block = grid[x][y];

            if (!block) continue;

            block.element.style.transform = 'rotate(' + (direction[block.direction]) * 90 + 'deg)';
        }
    }
};
