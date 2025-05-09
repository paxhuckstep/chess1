const handlePossibleLegalKnightMoves = (boardDataParam, coordinates) => {
    const newState = [...boardDataParam];

    newState.forEach((square) => {
      if (
        (square.xAxis === coordinates[0] + 2 &&
          (square.yAxis === coordinates[1] + 1 ||
            square.yAxis === coordinates[1] - 1)) ||
        (square.xAxis === coordinates[0] - 2 &&
          (square.yAxis === coordinates[1] + 1 ||
            square.yAxis === coordinates[1] - 1)) ||
        (square.yAxis === coordinates[1] + 2 &&
          (square.xAxis === coordinates[0] + 1 ||
            square.xAxis === coordinates[0] - 1)) ||
        (square.yAxis === coordinates[1] - 2 &&
          (square.xAxis === coordinates[0] + 1 ||
            square.xAxis === coordinates[0] - 1))
      ) {
        square.isLegal = true;
        square.isMaybeLegal = true; // isMaybeLegal doesn't do anything, just good for debugging during devolpement, will see throughout
      }
    });

    return newState;
  };

  const handleKnightObstacles = (boardDataParam, thisPieceColor) => {
    // only knight obstacle is not landing on your own piece, is used in all other piece obstacle handling
    const newState = [...boardDataParam];

    newState.forEach((square) => {
      if (square.isLegal && square.piece.includes(thisPieceColor)) {
        square.isLegal = false;
      }
    });

    return newState;
  };

  export {handlePossibleLegalKnightMoves, handleKnightObstacles}