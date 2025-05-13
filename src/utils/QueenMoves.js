import { handleBishopObstacles, handlePossibleLegalBishopMoves } from "./BishopMoves";
import { handlePossibleLegalRookMoves, handleRookObstacles } from "./RookMoves";

const handlePossibleLegalQueenMoves = (boardDataParam, coordinates) => {
    let updatedBoardData = handlePossibleLegalBishopMoves(boardDataParam, coordinates);
    updatedBoardData = handlePossibleLegalRookMoves(updatedBoardData, coordinates);
    return updatedBoardData;
  };

  const handleQueenObstacles = (boardDataParam, coordinates, thisPieceColor) => {
    let updatedBoardData = handleRookObstacles(boardDataParam, coordinates);
    updatedBoardData = handleBishopObstacles(updatedBoardData, coordinates, thisPieceColor);
    return updatedBoardData;
  };

  export {handlePossibleLegalQueenMoves, handleQueenObstacles}