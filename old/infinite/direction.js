var direction = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
};

// Non enumerable
Object.defineProperty(direction, 'values', {
    value: Object.keys(direction)
});

Object.defineProperty(direction, 'opposite', {
    value: function (dir) {
        dir = typeof dir === 'number' ? dir : direction[dir];

        return (dir + 2) % 4;
    }
});

Object.defineProperty(direction, 'next', {
    /**
     *
     * @param {Number} dir The current direction
     * @param {String|Number} amount How many places
     * @returns {number}
     */
    value: function (dir, amount) {
        dir = typeof dir === 'number' ? dir : direction[dir];

        if (typeof amount === 'string') {
            amount = this[amount];
        } else if (amount === undefined) {
            amount = 1;
        }
        return (dir + amount) % 4;
    }
});