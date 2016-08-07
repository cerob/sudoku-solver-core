/*  example sudoku input:
    410070005
    080006090
    000500000
    007401300
    530000012
    004308700
    000004000
    090800070
    700060028
*/
//var t1 = time.time();
var input = "410070005080006090000500000007401300530000012004308700000004000090800070700060028";
var SudokuTable = require("./SudokuTable.js");
var s = new SudokuTable(input);
s.printEXPERIMENTAL();
//var sol = s.printEXPERIMENTAL();

//console.log("INP = " + input);
//console.log("SOL = " + sol);
//console.log("SAME= " + (input == sol));