function Cell(data) {
    this.value = data;
    this.isConstant = data != null;
    
    if (!this.isConstant) {
        this.possibilityTable = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.isFinished = false; //TODO pls check from eliminating
    }
}

Cell.prototype.hasNextValue = function () {
    if (this.value == null) {
        return true;
    }
    if (this.possibilityTable.indexOf(this.value) + 1 == this.possibilityTable.length) {
        return false;
    } else {
        return true;
    }
}

Cell.prototype.setNextValue = function () {
    if (this.value == null) {
        this.value = this.possibilityTable[0];
    } else {
        var index = this.possibilityTable.indexOf(this.value);
        this.value = this.possibilityTable[index + 1];
    }
    return this.value;
}

Cell.prototype.eliminateNumber = function (num) {
    //console.log(this.possibilityTable.length);
    //console.log("num: " + num);
    var index = this.possibilityTable.indexOf(num);
    //console.log("index: " + index);
    if (index != -1) {
        this.possibilityTable.splice(index, 1);
    }

    if (this.possibilityTable.length == 1) {
        this.isConstant = true;
        this.isFinished = true;
        this.value = this.possibilityTable[0];
    }
}

module.exports = Cell;