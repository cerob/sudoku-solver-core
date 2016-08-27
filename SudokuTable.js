    var Cell = require("./Cell.js");
    var Region = require("./Region.js");

function SudokuTable (initialRawData) {
    this.table = [],
    this.rowSet = [],
    this.colSet = [],
    this.boxSet = [];
    
    this.setupTable(initialRawData);
    this.setupRegionSets();
    this.setupEliminations();
    
    this.currentCoordinates = [0, 0];
    this.lastCoordinates = [8, 8];
    this.pickLastCell();
    
    this.solve();
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
        this.table.push(row);
    }
}

SudokuTable.prototype.setupRegionSets = function () {
    for (var i=0; i<9; i++) {
        this.rowSet.push(new Region());
        this.colSet.push(new Region());
        this.boxSet.push(new Region());
    }

    for (var i=0; i<9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = this.table[i][j];
            this.rowSet[i].add(cell);
            this.colSet[j].add(cell);
            this.boxSet[this.getBoxNumber(i, j)].add(cell);
        }
    }
}

SudokuTable.prototype.setupEliminations = function () {
    for (var i=0; i<9; i++) {
        for (var j=0; j<9; j++) {
            var cell = this.table[i][j];
            if (cell.isConstant) {
                var val = cell.value;
                for (var k=0; k<9; k++) {
                    if (k != j) {
                        if (!this.rowSet[i].cells[k].isConstant) {
                            this.rowSet[i].cells[k].eliminateNumber(val);
                        }
                    }
                    
                    if (k != i) {
                        if (!this.colSet[j].cells[k].isConstant) {
                            this.colSet[j].cells[k].eliminateNumber(val);
                        }
                    }
                    
                    if (k != (3*(i%3) + (j%3))) {
                        if (!this.boxSet[this.getBoxNumber(i, j)].cells[k].isConstant) {
                            this.boxSet[this.getBoxNumber(i, j)].cells[k].eliminateNumber(val);
                        }
                    }
                }
            }
        }
    }
}

SudokuTable.prototype.next = function () {
    var i = this.currentCoordinates[0];
    var j = this.currentCoordinates[1] + 1;
    for (; i<9; i++){
        for (; j<9; j++) {
            var cell = this.table[i][j];
            if (!cell.isConstant) {
                this.currentCoordinates[0] = i;
                this.currentCoordinates[1] = j;
                return cell;
            }
        }
        j = 0;
    }
    return null;
}

SudokuTable.prototype.prev = function () {
    var i = this.currentCoordinates[0];
    var j = this.currentCoordinates[1] - 1;
    
    for (; i>=0; i--){
        for (; j>=0; j--) {
            var cell = this.table[i][j];
            if (!cell.isConstant) {
                this.currentCoordinates[0] = i;
                this.currentCoordinates[1] = j;
                return cell;
            }
        }
        j = 8;
    }
    return null;
}

SudokuTable.prototype.pickLastCell = function () {
    this.currentCoordinates[0] = this.lastCoordinates[0];
    this.currentCoordinates[1] = this.lastCoordinates[1];
    
    var c = this.table[this.currentCoordinates[0]][this.currentCoordinates[1]];
    if (c.isConstant) {
        c = this.prev();
    }
    
    this.lastCoordinates[0] = this.currentCoordinates[0];
    this.lastCoordinates[1] = this.currentCoordinates[1];
    
    this.currentCoordinates[0] = 0;
    this.currentCoordinates[1] = 0;
}

SudokuTable.prototype.solve = function () {
    var c = this.table[0][0].isConstant ? this.next() : this.table[0][0];
    
    while (true) {
        if (c.hasNextValue()) {
            c.setNextValue();
            
            if (this.checkContradictions(c)) {
                if (this.currentCoordinates[0] == this.lastCoordinates[0] && this.currentCoordinates[1] == this.lastCoordinates[1]) {
                    break;
                }
                c = this.next();
            } else {
                continue;
            }
            
        } else {
            c.value = null;
            c = this.prev();
        }
    }
}

SudokuTable.prototype.checkContradictions = function (cell) {
    return this.rowSet[this.currentCoordinates[0]].checkContradiction(cell)
                 && this.colSet[this.currentCoordinates[1]].checkContradiction(cell)
                 && this.boxSet[this.getBoxNumber(this.currentCoordinates[0], this.currentCoordinates[1])].checkContradiction(cell);
}

SudokuTable.prototype.getBoxNumber = function (row, col) {
    return (3 * Math.floor(row/3) + Math.floor(col/3));
}

SudokuTable.prototype.printLinearSolution = function () {
    var sol = "";
    for (var i=0; i<9; i++) {
        for (var j = 0; j < 9; j++) {
            var val = this.table[i][j].getValue();

            if (val == null) {
                sol += 0;
            } else {
                sol += val;
            }
        }
    }
    return sol;
}

SudokuTable.prototype.printBoard = function () {
    /*
      0 0 0  0 0 0  0 0 0
    */
    console.log();
    
    for (var i=0; i<9; i++) {
        
        var line = "";
        for (var j = 0; j < 9; j++) {
            var val = this.table[i][j].value;

            if (j % 3 == 0) {
                line += "  ";
            } else {
                line += " ";
            }

            if (val == null) {
                line += "-";
            } else {
                line += val;
            }
        }
        console.log(line);
        if ((i+1) % 3 == 0) {
            console.log();
        }
    }
    console.log();
}

SudokuTable.prototype.analyzeCellsWithTable = function () {
    console.log("X-Y    CONST   VAL     ISFINISHED");
    for (var i=0; i<9; i++) {
        for (var j = 0; j < 9; j++) {
            console.log(i + "-" + j + "   " + this.table[i][j].isConstant + "   " + this.table[i][j].value + "   " + this.table[i][j].isFinished);
        }
    }
}


module.exports = SudokuTable;