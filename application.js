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
        return gameOver;
      } else {
        let rowStart = i * 3;
        if (
          board[rowStart] !== 0 &&
          board[rowStart] === board[rowStart + 1] &&
          board[rowStart + 1] === board[rowStart + 2]
        ) {
          gameOver = true;
          return gameOver;
        }
      }
    }

    // check on diagonals and if full board
    if (board[0] !== 0 && board[0] === board[4] && board[4] === board[8]) {
      gameOver = true;
      return gameOver;
    } else if (
      board[2] !== 0 &&
      board[2] === board[4] &&
      board[4] === board[6]
    ) {
      gameOver = true;
      return gameOver;
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
  let pOne, pTwo, cPlayer;

  // Sets the name for player one and two
  const setName = (one, two) => {
    let playerOne, playerTwo, playerOneName, playerTwoName;

    playerOne = document.querySelector("#Player-One");
    playerTwo = document.querySelector("#Player-Two");
    playerOneName = playerOne.value;
    playerTwoName = playerTwo.value;

    // ensure that name is not nothing
    if (playerOneName === "") {
      playerTwo.classList.remove("invalid");
      playerOne.classList.add("invalid");
      return false;
    } else if (playerTwoName === "") {
      playerOne.classList.remove("invalid");
      playerTwo.classList.add("invalid");
      return false;
    }

    one.setName(playerOneName);
    two.setName(playerTwoName);
    return true;
  };

  const handleUserInput = (one, two, currentPlayer) => {
    display.textContent = "Start by putting in player information.";

    const submitBtn = document.querySelector(".user-input");
    submitBtn.addEventListener("click", function () {
      let setNameSuccess;

      setNameSuccess = setName(one, two);

      if (!setNameSuccess) {
        return;
      }

      // add players to the module
      pOne = one;
      pTwo = two;
      cPlayer = currentPlayer;
      removeInputInterface();

      allowChangeName();

      // displays which player to move
      interface.displayPlayer(
        cPlayer,
        gameBoard.checkGameOver(),
        gameBoard.checkHasWinner()
      );
    });

    // Handles the restart button
    restartBtn.addEventListener("click", function () {
      displayController.restartGame();
    });
  };

  // Help sets up the user input form
  const setUpInputForm = (inputForm, playerType) => {
    const player = document.createElement("div");
    player.setAttribute("class", "form-group");
    const pLabel = document.createElement("label");
    pLabel.setAttribute("for", `Player-${playerType}`);
    pLabel.setAttribute("class", "extra-space");
    pLabel.textContent = `Player ${playerType}:`;
    const pInput = document.createElement("input");
    pInput.setAttribute("required", "");
    pInput.setAttribute("type", "text");
    pInput.setAttribute("id", `Player-${playerType}`);
    pInput.setAttribute("Placeholder", `Player ${playerType} name`);
    player.appendChild(pLabel);
    player.appendChild(pInput);
    inputForm.appendChild(player);
  };

  const addInputInterface = (changeName) => {
    // clear Player move
    display.textContent = "Change the player's name above";

    // Stop the game until user name has been changed.
    pOne.setName(false);
    pTwo.setName(false);

    const inputForm = document.createElement("form");
    inputForm.setAttribute("class", "form player");

    setUpInputForm(inputForm, "One");
    setUpInputForm(inputForm, "Two");

    const submitBtn = document.createElement("div");
    submitBtn.setAttribute("type", "button");
    submitBtn.setAttribute("class", "btn btn-primary user-input");
    submitBtn.textContent = "submit";

    submitBtn.addEventListener("click", function () {
      let setNameSuccess;

      setNameSuccess = setName(pOne, pTwo);

      if (!setNameSuccess) {
        return;
      }
      interface.displayPlayer(
        displayController.getCurrentPLayer(),
        gameBoard.checkGameOver(),
        gameBoard.checkHasWinner()
      );
      removeInputInterface();
      changeName.classList.remove("active");
    });

    inputForm.appendChild(submitBtn);
    changeName.after(inputForm);
  };

  // Allow player to change names
  const allowChangeName = () => {
    const changeName = document.createElement("button");
    changeName.setAttribute("class", "btn btn-info");
    changeName.setAttribute("id", "change-Name");
    changeName.textContent = "Change Player name";
    restartBtn.after(changeName);

    changeName.addEventListener("click", function () {
      if (changeName.classList.contains("active")) {
        return; // only allow one instance of name change
      }
      changeName.classList.add("active");

      addInputInterface(changeName);
    });
  };

  const displayPlayer = (currentPlayer, gameOver, hasWinner) => {
    const name = currentPlayer.getName();
    if (!name) {
      return;
    }

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

  // Removes the user input form
  const removeInputInterface = () => {
    const inputInterface = document.querySelector(".form.player");
    main.removeChild(inputInterface);
  };

  // Resets the display
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

  // Restarts the game
  const restartGame = () => {
    gameBoard.reset();
    interface.reset();
    currentPlayer = one;
    interface.displayPlayer(
      currentPlayer,
      gameBoard.checkGameOver(),
      currentPlayer
    );
  };

  const getCurrentPLayer = () => currentPlayer;

  return { playNewGame, restartGame, getCurrentPLayer };
})(document);

displayController.playNewGame();
