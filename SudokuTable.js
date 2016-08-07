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
                        this.rowSet[i].cells[k].eliminateNumber(val);
                    }
                    
                    if (k != i) {
                        this.colSet[j].cells[k].eliminateNumber(val);
                    }
                    
                    if (k != (3*(i%3) + (j%3))) {
                        this.boxSet[this.getBoxNumber(i, j)].cells[k].eliminateNumber(val);
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

SudokuTable.prototype.solve = function () {
    var c = this.table[0][0].isConstant ? this.next() : this.table[0][0];
    
    while (true) {
        
        console.log("NOW ON: (" + this.currentCoordinates[0] + ", " + this.currentCoordinates[1] + ")");
        
        if (c.hasNextValue()) {
            var newVal = c.setNextValue();
            if (this.rowSet[this.currentCoordinates[0]].checkContradiction(c)
                 && this.colSet[this.currentCoordinates[1]].checkContradiction(c)
                 && this.boxSet[this.getBoxNumber(this.currentCoordinates[0], this.currentCoordinates[1])].checkContradiction(c)) {
                     if (this.currentCoordinates[0] == 8 && this.currentCoordinates[1] == 8) {
                         break;
                     }
                     c = this.next();
                 } else {
                     
                 }
        } else {
            c.value = null;
            c = c.prev();
        }
    }
    
    console.log("FINISH!");
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



module.exports = SudokuTable;