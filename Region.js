function Region(name, index) {
    this.isCompleted = false;
    this.possibilityTable = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.cells = [];
    //var Cell = require("./Cell.js");
    this.name = name;
    this.index = index;
}

Region.prototype.add = function (cell) {
    this.cells.push(cell);
    //console.log("VAL " + cell.getValue() + " LEN " +this.cells.length);
}

Region.prototype.getCell = function (index) {
    return this.cells[index];
}

Region.prototype.EXP_print = function () {
    var sol = "";
    for (var i=0; i<this.cells.length; i++) {
        var val = this.cells[i].getValue();
        //console.log("typeof: " + typeof val);
        if (val == null) {
            sol += 0;
        } else {
            sol += val;
        }
        sol += val;
    }
    return sol;
}

Region.prototype.eliminateFromPossTable = function (num) {
    if (num == null) {
        var ret = this.possibilityTable[0];
        this.possibilityTable = null;
        return ret;
    }

    var index = this.possibilityTable.indexOf(num);
    if (index != -1) {
        this.possibilityTable.splice(index, 1);
    }
}

Region.prototype.scan = function () {
    if (this.isCompleted) {
        return;
    }

    for (var i=0; i<this.cells.length; i++) {
        if (this.cells[i].isOK()) {
            this.eliminateFromPossTable(this.cells[i].getValue());
        }
    }

    //check for length 1 and complete table
    if (this.possibilityTable.length == 1) {
        for (var i=0; i<this.cells.length; i++) {
            if (!this.cells[i].isOK()) {
                this.cells[i].setValue(this.eliminateFromPossTable(null));
                this.isCompleted = true;
            }
        }
    }

    //check if empty
    if (this.possibilityTable.length == 0) {
        this.isCompleted = true;
    }
}

module.exports = Region;