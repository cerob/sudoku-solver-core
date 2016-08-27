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

var input = "410070005080006090000500000007401300530000012004308700000004000090800070700060028";
var SudokuTable = require("./SudokuTable.js");


var start = new Date().getTime();

var table = new SudokuTable(input);

var end = new Date().getTime();
var time = end - start;

table.printBoard();
console.log('Execution time: ' + time + " ms");