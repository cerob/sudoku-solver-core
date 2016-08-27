    var Cell = require("./Cell.js");
    var Region = require("./Region.js");

function SudokuTable (initialRawData) {
    this.table = [],
    this.rowSet = [],
    this.colSet = [],
    this.boxSet = [];
    
    this.setupTable(initialRawData);
    //console.log("1 OK");
    this.setupRegionSets();
    //console.log("2 OK");
    //this.analyzeCellsWithTable();
    this.setupEliminations();
    //console.log("3 OK");

    this.currentCoordinates = [0, 0];
    this.lastCoordinates = [8, 8];
    this.pickLastCell();
    
    //this.printBoard();
    
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
                //console.log("cell.value= " + val);
                for (var k=0; k<9; k++) {
                    //console.log(k);
                    if (k != j) {
                        if (!this.rowSet[i].cells[k].isConstant) {
                            //console.log("r eliminated: " + i + ", " + k);
                            this.rowSet[i].cells[k].eliminateNumber(val);
                        }
                    }
                    
                    if (k != i) {
                        if (!this.colSet[j].cells[k].isConstant) {
                            //console.log("c eliminated: " + i + ", " + k);
                            this.colSet[j].cells[k].eliminateNumber(val);
                        }
                    }
                    
                    if (k != (3*(i%3) + (j%3))) {
                        if (!this.boxSet[this.getBoxNumber(i, j)].cells[k].isConstant) {
                            //console.log("b eliminated: " + i + ", " + k);
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
    
    /*if (i == 0 && j == 1 && !this.table[0][0].isConstant) {
        return this.table[0][0];
    }*/
    
    /*    console.log(i);
    console.log(j);
    console.log("VAL " + this.getCell(i, j).value);
    console.log("CNS " + this.getCell(i, j).isConstant);*/
    for (; i<9; i++){
        for (; j<9; j++) {
            var cell = this.table[i][j];
            if (!cell.isConstant) {
    /*                console.log(i);
                console.log(j);
                console.log("val " + this.getCell(i, j).value);
                console.log("cns " + this.getCell(i, j).isConstant);*/
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
    
    while (true/*!(this.checkContradictions(c) && this.currentCoordinates[0] == 8 && this.currentCoordinates[1] == 8)*/) {
        //console.log("NOW ON: (" + this.currentCoordinates[0] + ", " + this.currentCoordinates[1] + "), value: " + c.value);
        //this.printBoard();
        
        if (c.hasNextValue()) {
            c.setNextValue();
            
            var contr = this.checkContradictions(c);
            //console.log("contr: " + contr);
            if (contr) {
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
    
    //console.log("FINISH!");
    //this.printBoard();
}

SudokuTable.prototype.checkContradictions = function (cell) {
    return this.rowSet[this.currentCoordinates[0]].checkContradiction(cell)
                 && this.colSet[this.currentCoordinates[1]].checkContradiction(cell)
                 && this.boxSet[this.getBoxNumber(this.currentCoordinates[0], this.currentCoordinates[1])].checkContradiction(cell);
}

SudokuTable.prototype.getBoxNumber = function (row, col) {
    return (3 * Math.floor(row/3) + Math.floor(col/3));
}

SudokuTable.prototype.printEXPERIMENTAL = function () {
    /*    console.log("rowSet");
    for (var i=0; i<9; i++) {
        this.rowSet[i].EXP_print();
    }
    console.log("");
    
    console.log("colSet");
    for (var i=0; i<9; i++) {
        this.colSet[i].EXP_print();
    }
    console.log("");
    
    console.log("boxSet");
    for (var i=0; i<9; i++) {
        this.boxSet[i].EXP_print();
    }*/
}

SudokuTable.prototype.printSolution = function () {
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
            console.log(i + "-" + j + "   " + this.table[i][j].isConstant + "   " + this.table[i][j].value + "   " + this.table[i][j].isFinished + "    " + typeof this.table[i][j].possibilityTable);
        }
    }
}


module.exports = SudokuTable;