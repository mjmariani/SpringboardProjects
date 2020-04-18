/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

window.addEventListener('load', (e) => {




const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = [];  // array of rows, each row is array of cells  (board[y][x])

/*
For the board variable above:

Array(WIDTH) generates an array with length = WIDTH and full of undefined values.
Each of these arrays are then mapped to another array full of undefined values.
Finally, a WIDTHxHEIGHT grid full of undefined positions is created.

*/

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(/*columnCount, rowCount*/) {
  // Set "board" to empty HEIGHT x WIDTH matrix array
  //This array is used for the logic.

 board = [...Array(WIDTH)].map(e => Array(HEIGHT)); 
 board.every((row) => row.fill(undefined));


/* const map = [];
for(let x=0; x<columnCount; x++){
  map[x] = []; //set up inner array
  for(let y = 0; y< rowCount; y++){
    addCell(map, x, y);
  }
}
return map; */


}


/*
function addCell(map, x, y){
 map[x][y] = cell(); //create a new object on x and y

}

*/


/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // Get "htmlBoard" variable from the item in HTML w/ID of "board"
  //function used to create the board in HTML

  const board = document.querySelector("#board");



  
  const top = document.createElement("tr"); //Creating the first row 
  top.setAttribute("id", "column-top"); //Setting the id attribute of the first row to column-top
  top.addEventListener("click", handleClick); //adding an event listener to the top row to listen for a click and when the event occurs, it calls the handleClick function

  /*************************************************************************************************************************************  
  Code below creates columns using a "for loop"; looping x from zero to the width number - 1. Also sets the id's for each column from 0 - (width - 1) and appends them to the "top" row.
  Then it appends the "top" row to the board DOM element.
  This is for creating cells within the top row.
  **************************************************************************************************************************************/

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");    
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  board.append(top);

  // TODO: add comment for this code
/**************************************************************************************************************************************** 
The below code creates the table for the board elements based on the height variable (number of rows) and the width variable (number of columns). It appends each cell or column to a row
then appends each row to the htmlBoard.


****************************************************************************************************************************************/


  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for(let y = HEIGHT - 1; y >= 0; y--){
    if(board[x][y] === undefined){
      //due to the way the board array was created, I need to use [x][y] instead of [y][x]
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`); //using template literal to input currentPlayer as there are 2 ids (one for each player: p1 and p2)
  //piece.style.top = -50 * (y + 2);
  const cell = document.getElementById(`${y}-${x}`);
  cell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[x][y] = currPlayer;
  //Setting the value of each cell to the player who chose the cell

  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call the function endGame
  //every function uses a call back function for each value in the array
  //call back function uses arrow function 

  let isBoardFilled = board.every((row) => row.every((cell) => cell));

  if(isBoardFilled){
    return endGame("Tie!!!");
  }

  //if the board is a truthy value, then return a message through the endGame function with argument (message) "Tie!"


  // switch players
  // TODO: switch currPlayer 1 <-> 2

  /* if(currPlayer == 1){
    currPlayer = 2;
  }else{
    currPlayer = 1;
  }
  */

  //if currPlayer is 1 then assign 2 to the variable otherwise, assign it to 1.
  currPlayer = currPlayer == 1 ? 2 : 1; 

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
let restartBtn = document.querySelector(".btn");
restartBtn.addEventListener('click', function(e){
e.preventDefault();
location.reload(true);


});
});

