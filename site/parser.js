/**
 * Create a board from a specific html structure
 *
 * @param element HTMLElement
 * @param width Number
 * @param height Number
 *
 * @constructor
 */
var Html = function (element, width, height) {
    /**
     * Root element
     *
     * @type HTMLElement
     */
    this.element = element;

    /**
     * Each block's element
     *
     * @type {HTMLElement[]}
     */
    this.elements = [];

    /**
     * Width of the grid
     *
     * @type Number
     */
    this.width = width;

    /**
     * Height of the grid
     *
     * @type Number
     */
    this.height = height;
};

/**
 * Parse the input to a board
 *
 * @param types Object<string, Block> Map of name, type
 * @returns {{width: Number, height: Number, blocks: Array}}
 */
Html.prototype.input = function (types) {
    var els = this.element.querySelectorAll('div'),
        width = this.width,
        blocks = [];

    for (var i = 0; i < els.length; i++) {
        var type = els[i].dataset.type;

        if (types[type]) {
            var block = new types[type](type);

            blocks.push(block);
        } else {
            blocks.push(false);
        }

        this.elements.push(els[i]);
    }

    return {
        width: width,
        height: this.height,
        blocks: blocks
    }
};