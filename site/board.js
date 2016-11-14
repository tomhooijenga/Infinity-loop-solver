function Board(element) {
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

Board.prototype.render = function (blocks, elements) {
    blocks.blocks.forEach(function (block, index) {
        if (!block) {
            return;
        }

        elements[index].style.transform = 'rotate(' + (block.direction * 90) + 'deg)';
    });
};