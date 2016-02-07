function End() {
    Block.apply(this, arguments);
}

End.prototype = Object.create(Block.prototype);
End.prototype.constructor = End;

End.prototype.sides = [direction.up];

End.prototype.best = function (board) {
    var neighbours = this.neighbours,
        nextdir;

    for (var dir in neighbours) {
        if (!neighbours.hasOwnProperty(dir)) continue;

        var neighbour = neighbours[dir];

        if (!neighbour) continue;

        if (!neighbour.fixed) continue;

        var opposite = (direction[dir] + 2) % 4;

        if (neighbour.relative().indexOf(opposite) !== -1) {
            nextdir = direction[dir];
            break;
        }
    }

    if (nextdir !== undefined) {
        this.direction = nextdir;

        this.fixed = true;
    }
};