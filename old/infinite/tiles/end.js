function End() {
    Tile.call(this);
}

End.prototype = Object.create(Tile.prototype);
End.prototype.constructor = End;

End.prototype.sides = [true, false, false, false];