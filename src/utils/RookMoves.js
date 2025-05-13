import { handleKnightObstacles } from "./knightMoves";

const handlePossibleLegalRookMoves = (boardDataParam, coordinates) => {
    const newState = [...boardDataParam];
    console.log("boardDataparam: ", boardDataParam, "coordinates: ", coordinates)

    newState.forEach((square) => {
      if (
        (square.xAxis === coordinates[0] ||
          square.yAxis === coordinates[1]) &&
        !(
          square.xAxis === coordinates[0] &&
          square.yAxis === coordinates[1]
        )
      ) {
        square.isLegal = true;
        square.isMaybeLegal = true;
      }
    });

    return newState;
  };

  const handleRookObstacles = (boardDataParam, coordinates, thisPieceColor) => {
    const newState = [...boardDataParam];
    const xRightBlocks = [];
    const xLeftBlocks = [];
    const yUpBlocks = [];
    const yDownBlocks = [];

    newState.forEach((square) => {
      if (square.isLegal && square.piece.includes("piece__")) {
        // these fill with all the position of all pieces on the same straight line paths as the rook
        if (square.xAxis === coordinates[0]) {
          if (square.yAxis > coordinates[1]) {
            yUpBlocks.push(square.yAxis);
          }
          if (square.yAxis < coordinates[1]) {
            yDownBlocks.push(square.yAxis);
          }
        }
        if (square.yAxis === coordinates[1]) {
          if (square.xAxis > coordinates[0]) {
            xRightBlocks.push(square.xAxis);
          }
          if (square.xAxis < coordinates[0]) {
            xLeftBlocks.push(square.xAxis);
          }
        }
      }
    });

    newState.forEach((square) => {
      // this makes sure the rook doesn't move past the closest piece in each direction
      if (
        (square.xAxis < Math.max(...xLeftBlocks) &&
          square.yAxis === coordinates[1]) ||
        (square.xAxis > Math.min(...xRightBlocks) &&
          square.yAxis === coordinates[1]) ||
        (square.yAxis > Math.min(...yUpBlocks) &&
          square.xAxis === coordinates[0]) ||
        (square.yAxis < Math.max(...yDownBlocks) &&
          square.xAxis === coordinates[0])
      ) {
        square.isLegal = false;
      }
    });
    return handleKnightObstacles(newState, thisPieceColor);
  };

  export {handlePossibleLegalRookMoves, handleRookObstacles}