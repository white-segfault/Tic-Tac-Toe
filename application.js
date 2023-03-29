// The player object, part of the model of the program
const Player = (type) => {
  let name = false;

  const setName = (input) => {
    name = input;
  };
  const getType = () => type;
  const getInputType = () => (type == 1 ? "O" : "X");
  const getName = () => name;
  return { setName, getType, getInputType, getName };
};

// Game board object, part of the model of the program
const gameBoard = (() => {
  // 0 for unfilled board
  let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let gameOver = false;
  let hasWinner = true;

  // Tries to place the iterm on the board and returns whether
  // it is successfully placed on the board
  const placeItem = (player, position, grid) => {
    if (board[position] != 0 || gameOver) {
      // cannot fill board, ignore operation
      return false;
    } else if (player.getName() === false) {
      return false;
    }
    // now we fill board
    grid.textContent = board[position] = player.getInputType();
    return true;
  };

  // Check if the game is over
  const checkGameOver = () => {
    // brute force checking:
    // 8 possibilities, 3 on column, 3 on row and 2 on columns
    // then check if it is filled with items already.

    // check on columns first

    // check on columns first
    for (let i = 0; i < 3; i++) {
      // column check
      if (
        board[i] !== 0 &&
        board[i] === board[i + 3] &&
        board[i + 3] === board[i + 6]
      ) {
        gameOver = true;
      } else {
        let rowStart = i * 3;
        if (
          board[rowStart] !== 0 &&
          board[rowStart] === board[rowStart + 1] &&
          board[rowStart + 1] === board[rowStart + 2]
        ) {
          gameOver = true;
        }
      }
    }

    // check on diagonals and if full board
    if (board[0] !== 0 && board[0] === board[4] && board[4] === board[8]) {
      gameOver = true;
    } else if (
      board[2] !== 0 &&
      board[2] === board[4] &&
      board[4] === board[6]
    ) {
      gameOver = true;
    } else if (
      board[0] !== 0 &&
      board[1] !== 0 &&
      board[2] != 0 &&
      board[3] != 0 &&
      board[4] != 0 &&
      board[5] != 0 &&
      board[6] != 0 &&
      board[7] != 0 &&
      board[8] != 0
    ) {
      gameOver = true;
      hasWinner = false;
    }
    console.log(gameOver);
    return gameOver;
  };

  // Resets the board
  const reset = () => {
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    gameOver = false;
    hasWinner = true;

    const grids = document.querySelectorAll(".cell");
    for (let i = 0; i < grids.length; i++) {
      grids[i].textContent = "";
    }
  };

  const checkHasWinner = () => {
    return hasWinner;
  };

  return { placeItem, checkGameOver, checkHasWinner, reset };
})();

// The interface for the board
const interface = (() => {
  const main = document.querySelector(".interface");
  const display = document.querySelector(".player-to-move");
  const restartBtn = document.querySelector("#restart");

  const handleUserInput = (one, two, currentPlayer) => {
    const submitBtn = document.querySelector(".user-input");
    submitBtn.addEventListener("click", function () {
      let playerOneName, playerTwoName;
      playerOneName = document.querySelector("#Player-One").value;
      playerTwoName = document.querySelector("#Player-Two").value;

      one.setName(playerOneName);
      two.setName(playerTwoName);

      removeInputInterface();

      // displays which player to move
      interface.displayPlayer(currentPlayer, false, one);
    });

    // Handles the restart button
    restartBtn.addEventListener("click", function () {
      displayController.restartGame();
    });
  };

  const displayPlayer = (currentPlayer, gameOver, hasWinner) => {
    const name = currentPlayer.getName();
    if (!gameOver) {
      display.textContent = `It's ${name}'s move.`;
      return;
    }
    if (hasWinner) {
      display.textContent = `${name} is the winner.`;
    } else {
      display.textContent = "Tie game.";
    }
  };

  const removeInputInterface = () => {
    const inputInterface = document.querySelector(".form.player");
    main.removeChild(inputInterface);
  };

  const reset = () => {
    display.textContent = "";
  };

  return { handleUserInput, displayPlayer, reset };
})(document);

// The controller of the program
const displayController = (() => {
  const one = Player(1);
  const two = Player(2);
  let currentPlayer = one;

  // Plays a new game
  const playNewGame = () => {
    // Handles user input
    interface.handleUserInput(one, two, currentPlayer);
    // Set up the bindings
    const grids = document.querySelectorAll(".cell");

    for (let i = 0; i < grids.length; i++) {
      grids[i].addEventListener("click", function () {
        const position = +grids[i].getAttribute("id");
        const placeSucess = gameBoard.placeItem(
          currentPlayer,
          position,
          grids[i]
        );
        let gameOver, hasWinner;

        if (placeSucess) {
          gameOver = gameBoard.checkGameOver();
          hasWinner = gameBoard.checkHasWinner();
          // new private helper can be created if needed
          // switch players
          if (gameOver) {
            // do nothing
          } else if (currentPlayer === one) {
            currentPlayer = two;
          } else {
            currentPlayer = one;
          }
          interface.displayPlayer(currentPlayer, gameOver, hasWinner);
        }
      });
    }
  };

  const restartGame = () => {
    gameBoard.reset();
    interface.reset();
    currentPlayer = one;
  };

  return { playNewGame, restartGame };
})(document);

displayController.playNewGame();
