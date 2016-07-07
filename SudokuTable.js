function SudokuTable (initialData) {
    var Cell = require("./Cell.js");
    this.table = [];

    for (var i=0; i<9; i++) {
        var row = [];
        for (var j=0; j<9; j++) {
            var char = initialData.charAt(9 * i + j);
            if (char >= 1 && char <= 9) {
                row.push(new Cell(char));
            } else {
                row.push(new Cell(null));
            }
        }
        this.table.push(row);
    }

    this.solve();
}

SudokuTable.prototype.getCell = function (row, col) {
    return this.table[row][col];
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

SudokuTable.prototype.solve = function () {
    this.basicElimination();
}

SudokuTable.prototype.basicElimination = function () {
    for (var i=0; i<9; i++) {
        for (var j = 0; j < 9; j++) {
            this.check(i, j);
        }
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

module.exports = SudokuTable;