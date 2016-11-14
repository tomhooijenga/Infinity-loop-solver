/**
 * @constructor
 */
function Block(type) {
    var _direction;

    Object.defineProperty(this, 'direction', {
        get: function () {
            return _direction;
        },
        set: function (value) {
            _direction = value;

            direction.values.forEach(function (dir) {
                var relative = direction.next(dir, value);

                this.open[relative] = this.sides.indexOf(direction[dir]) !== -1;
            }, this);
        }
    });

    this.open = [];

    this.direction = direction.up;

    this.fixed = false;

    this.neighbours = [];

    this.type = type;
}

Block.prototype.sides = [];