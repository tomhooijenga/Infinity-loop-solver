function End() {
    Block.apply(this, arguments);
}

End.prototype = Object.create(Block.prototype);
End.prototype.constructor = End;

End.prototype.sides = [direction.up];