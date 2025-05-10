import { handleBishopObstacles, handlePossibleLegalBishopMoves } from "./BishopMoves";
import { handlePossibleLegalRookMoves, handleRookObstacles } from "./RookMoves";

const handlePossibleLegalQueenMoves = (boardDataParam, coordinates, thisPieceColor) => {
    let updatedBoardData = handlePossibleLegalBishopMoves(boardDataParam, coordinates);
    updatedBoardData = handlePossibleLegalRookMoves(updatedBoardData, coordinates, thisPieceColor);
    return updatedBoardData;
  };

  const handleQueenObstacles = (boardDataParam, coordinates) => {
    let updatedBoardData = handleRookObstacles(boardDataParam, coordinates);
    updatedBoardData = handleBishopObstacles(updatedBoardData, coordinates, thisPieceColor);
    return updatedBoardData;
  };

  export {handlePossibleLegalQueenMoves, handleQueenObstacles}