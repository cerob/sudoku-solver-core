## sudoku-solver-core ##
A simple, node.js made, lighting fast **sudoku solver** with *backtracking method*.

### Usage ###
Just create an instance of `SudokuTable` object, it will be solved.

For input syntax, this project uses a linear 81 length string, use zeros for unknown digits.

Example usage:

    var SudokuTable = require("./SudokuTable.js");
    
    var input = "410070005080006090000500000007401300530000012004308700000004000090800070700060028";

    var table = new SudokuTable(input);

<br />
You can take solutions with two ways: One of them is `getLinearSolution` method and returns a string object such as `416279835385146297279583641927451386538697412164328759852714963691832574743965128` whereas the other one is `printBoard` method which prints to console a table-view:

      4 1 6  2 7 9  8 3 5
      3 8 5  1 4 6  2 9 7
      2 7 9  5 8 3  6 4 1
    
      9 2 7  4 5 1  3 8 6
      5 3 8  6 9 7  4 1 2
      1 6 4  3 2 8  7 5 9
    
      8 5 2  7 1 4  9 6 3
      6 9 1  8 3 2  5 7 4
      7 4 3  9 6 5  1 2 8


### Contributing ###
Any kind of contributions are kindly welcomed. You may find some bugs, please report them, feel free to fix, create your branches, and request for a pull.

### License ###
sudoku-solver-core is licensed under [MIT License](https://github.com/efsantrifuge/sudoku-solver-core/raw/master/LICENSE).

### Donations ###
Curently I have no account for donations, but I will add it here as soon as possible.
You can take me a coffee. : )