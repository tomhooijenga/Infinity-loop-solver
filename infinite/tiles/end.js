function End() {
    Tile.apply(this, arguments);
}

End.prototype = Object.create(Tile.prototype);
End.prototype.constructor = End;

End.prototype.sides = [direction.up];