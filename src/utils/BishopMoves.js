import { handleKnightObstacles } from "./knightMoves";

const handlePossibleLegalBishopMoves = (boardDataParam, coordinates) => {
    const newState = [...boardDataParam];

    newState.forEach((square) => {
      for (let i = 1; i < 8; i++) {
        // fill the diagonals with legal
        if (
          (square.xAxis === coordinates[0] + i &&
            square.yAxis === coordinates[1] + i) ||
          (square.xAxis === coordinates[0] - i &&
            square.yAxis === coordinates[1] + i) ||
          (square.xAxis === coordinates[0] + i &&
            square.yAxis === coordinates[1] - i) ||
          (square.xAxis === coordinates[0] - i &&
            square.yAxis === coordinates[1] - i)
        ) {
          square.isLegal = true;
          square.isMaybeLegal = true;
        }
      }
    });

    return newState;
  };

  const handleBishopObstacles = (boardDataParam, coordinates, thisPieceColor) => {
    // console.log("handleBishopObstacles fired")
    const newState = [...boardDataParam];
    const upLeftBlocks = [];
    const upRightBlocks = [];
    const downLeftBlocks = [];
    const downRightBlocks = [];

    newState.forEach((square) => {
      const xDiff = square.xAxis - coordinates[0];
      const yDiff = square.yAxis - coordinates[1];
      // finds obstacles like rooks, but now on diagonals instead of straight line paths
      if (
        Math.abs(xDiff) === Math.abs(yDiff) &&
        square.piece.includes("piece__")
      ) {
        if (
          square.xAxis < coordinates[0] &&
          square.yAxis > coordinates[1]
        ) {
          upLeftBlocks.push(square.xAxis);
        }
        if (
          square.xAxis > coordinates[0] &&
          square.yAxis > coordinates[1]
        ) {
          upRightBlocks.push(square.xAxis);
        }
        if (
          square.xAxis < coordinates[0] &&
          square.yAxis < coordinates[1]
        ) {
          downLeftBlocks.push(square.xAxis);
        }
        if (
          square.xAxis > coordinates[0] &&
          square.yAxis < coordinates[1]
        ) {
          downRightBlocks.push(square.xAxis);
        }
      }
    });

    newState.forEach((square) => {
      // don't move past closest piece on each diagonal, closest piece being the same color is handled with handleKnightObstacles
      if (
        (square.xAxis < Math.max(...upLeftBlocks) &&
          square.yAxis > coordinates[1]) ||
        (square.xAxis > Math.min(...upRightBlocks) &&
          square.yAxis > coordinates[1]) ||
        (square.xAxis < Math.max(...downLeftBlocks) &&
          square.yAxis < coordinates[1]) ||
        (square.xAxis > Math.min(...downRightBlocks) &&
          square.yAxis < coordinates[1])
      ) {
        square.isLegal = false;
      }
    });

    return handleKnightObstacles(newState, thisPieceColor); // if piece is same color don't land on it
  };

  export {handlePossibleLegalBishopMoves, handleBishopObstacles}