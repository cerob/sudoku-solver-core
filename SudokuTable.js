//var rowSingularity, colSingularity, regionSingularity = [];

var Cell = require("./Cell.js");
var Region = require("./Region.js");

var table = [],
    rowSet = [],
    colSet = [],
    boxSet = [];

function SudokuTable (initialRawData) {

    this.setupTable(initialRawData);
    this.setupRegionSets();

    //this.solve();
}

SudokuTable.prototype.setupTable = function (data) {
    for (var i=0; i<9; i++) {
        var row = [];
        for (var j=0; j<9; j++) {
            var char = data.charAt(9 * i + j);
            if (char >= 1 && char <= 9) {
                row.push(new Cell(char));
            } else {
                row.push(new Cell(null));
            }
        }
        table.push(row);
    }
}

/*SudokuTable.prototype.controls = function () {
    console.log(boxSet[8].index);
}*/

SudokuTable.prototype.setupRegionSets = function () {
    for (var i=0; i<9; i++) {
        rowSet.push(new Region("row", i));
        colSet.push(new Region("col", i));
        boxSet.push(new Region("box", i));
    }

    for (var i=0; i<9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = this.getCell(i, j);
            rowSet[i].add(cell);
            //colSet[j].add(cell);
            //boxSet[3 * Math.floor(i/3) + Math.floor(j/3)].add(this.getCell(3 * Math.floor(i/3) + Math.floor(j/3), 3 * (i%3) + j%3));
            
            /*rowSet[i][j] = cell;
            colSet[j][i] = cell;
            boxSet[3 * Math.floor(i/3) + Math.floor(j/3)][3 * (i%3) + j%3] = cell;*/
        }
    }
}

SudokuTable.prototype.getCell = function (row, col) {
    return table[row][col];
}

SudokuTable.prototype.printEXPERIMENTAL = function () {
    /*//rows
    var sol = "";
    for (var i=0; i<9; i++) {
        for (var j = 0; j < 9; j++) {
            var val = rowSet[i].getCell(j).getValue();

            if (val == null) {
                sol += 0;
            } else {
                sol += val;
            }
        }
    }
    return sol;*/
    for (var i=0; i<9; i++) {
        var ff = rowSet[i].EXP_print();
        console.log(ff + "  ---  " + ff.length + "  ---  " + rowSet[i].name + rowSet[i].index);
    }
}

SudokuTable.prototype.printSolution = function () {
    var sol = "";
    for (var i=0; i<9; i++) {
        for (var j = 0; j < 9; j++) {
            var val = this.getCell(i, j).getValue();

            if (val == null) {
                sol += 0;
            } else {
                sol += val;
            }
        }
    }
    return sol;
}

SudokuTable.prototype.solve = function () {
    this.basicElimination();
}

SudokuTable.prototype.basicElimination = function () {
    for (var i=0; i<9; i++) {
        for (var j = 0; j < 9; j++) {
            if (!this.getCell(i, j).isOK()) {
                this.check(i, j);
            }
        }
    }
}

SudokuTable.prototype.scan = function () {

}


SudokuTable.prototype.checkRemainder = function (row, col) {
    rowSingularity[row] -= 1;
    colSingularity[col] -= 1;
    regionSingularity[Math.floor(row/3) + Math.floor(col/3)] -= 1;

    if (rowSingularity[row] == 1) {this.solveSingularity(row, col, "row");}
    if (colSingularity[col] == 1) {this.solveSingularity(row, col, "col");}
    if (regionSingularity[Math.floor(row/3) + Math.floor(col/3)] == 1) {this.solveSingularity(row, col, "reg");}
}

SudokuTable.prototype.solveSingularity = function (row, col, direction) {
    if (direction == "row") {
        for (var i=0; i<9; i++) {

        }
    }
//TODO dont forget to reset singularities
}


SudokuTable.prototype.check = function (row, col) {
    if (this.checkByCol(row, col)) {
        if (this.checkByRow(row, col)) {
            return this.checkByRegion(row, col);
        }
        return false;
    }
    return false;
}



SudokuTable.prototype.checkByRow = function (row, col) {
    var cell = this.getCell(row, col);

    for (var i=0; i<9; i++) {
        if (i == col) {continue;}

        var curr = this.getCell(row, i);
        if (curr>=1 && curr<=9) {
            cell.eliminateNumber(curr);
        }
    }
    return cell.isOK();
}


SudokuTable.prototype.checkByCol = function (row, col) {
    var cell = this.getCell(row, col);

    for (var i=0; i<9; i++) {
        if (i == row) {continue;}

        var curr = this.getCell(i, col);
        if (curr>=1 && curr<=9) {
            cell.eliminateNumber(curr);
        }
    }
    return cell.isOK();
}

SudokuTable.prototype.checkByRegion = function (row, col) {
    var cell = this.getCell(row, col);

    var rowset, colset;

    if (col >= 0 && col <=2) {
        colset = [0, 1, 2];
    } else if (col >= 3 && col <=5) {
        colset = [3, 4, 5];
    } else if (col >= 6 && col <=8) {
        colset = [6, 7, 8];
    }

    if (row >= 0 && row <=2) {
        rowset = [0, 1, 2];
    } else if (row >= 3 && row <=5) {
        rowset = [3, 4, 5];
    } else if (row >= 6 && row <=8) {
        rowset = [6, 7, 8];
    }

    var rowsetlen = rowset.length,
        colsetlen = colset.length;
    for (var i=0; i<rowsetlen; i++) {
        for (var j=0; j<colsetlen; j++) {
            if (rowset[i] == row && colset[j] == col) {continue;}

            var curr = this.getCell(rowset[i], colset[j]);

            if (curr>=1 && curr<=9) {
                cell.eliminateNumber(curr);
            }
        }
    }

    return cell.isOK();
}



module.exports = SudokuTable;