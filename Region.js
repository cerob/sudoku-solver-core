function Region() {
    this.cells = [];
}

Region.prototype.add = function (cell) {
    this.cells.push(cell);
}

// for any contradiction, returns FALSE
Region.prototype.checkContradiction = function (cell) {
    var val = cell.value;
    var foundOriginal = false;
    
    for (var i=0; i<9; i++) {
        if (cells[i].value = val && foundOriginal){
            return false;
        }
        if (cells[i].value = val && !foundOriginal){
            foundOriginal = true;
        }
    }
    return true;
}

Region.prototype.EXP_print = function () {
    var sol = "";
    for (var i=0; i<this.cells.length; i++) {
        var val = this.cells[i].value;
        //console.log("typeof: " + typeof val);
        if (val == null) {
            sol += 0;
        } else {
            sol += val;
        }
    }
    console.log(sol);
}

module.exports = Region;