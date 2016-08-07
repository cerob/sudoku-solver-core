function Cell(data) {
    this.value = data;
    this.isDiscovered = data != null;
    this.possibilityTable = data != null ? [] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
}

Cell.prototype.isOK = function () {
    return this.isDiscovered;
}

Cell.prototype.getValue = function () {
    return this.value;
}

Cell.prototype.setValue = function (value) {
    this.value = value;
    this.possibilityTable = null;
    this.isDiscovered = true;
}

Cell.prototype.eliminateNumber = function (num) {
    var index = this.possibilityTable.indexOf(num);
    if (index != -1) {
        this.possibilityTable.splice(index, 1);
    }

    if (this.possibilityTable.length == 1) {
        this.isDiscovered = true;
        this.setValue(this.possibilityTable[0]);
        return true;
    } else {
        return false;
    }
}

module.exports = Cell;