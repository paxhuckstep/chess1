import { useEffect, useState } from "react";
import "./Board.css";
import BoardBackground from "../BoardBackground/BoardBackground";
import Pieces from "../Pieces/Pieces";
import { startingBoardData } from "../../utils/startingBoardData";
import { alphabetArray } from "../../utils/constants";
import PromotionSelector from "../PromotionSelector/PromotionSelector";
import GameOverPopup from "../GameOverPopup/GameOverPopup";
import { handlePossibleLegalKnightMoves, handleKnightObstacles } from "../../utils/knightMoves";
import { handleBishopObstacles, handlePossibleLegalBishopMoves } from "../../utils/BishopMoves";
import { handlePossibleLegalRookMoves, handleRookObstacles } from "../../utils/RookMoves";
import { handlePossibleLegalQueenMoves, handleQueenObstacles } from "../../utils/QueenMoves";

function Board({ shouldReset, setShouldReset }) {
  const [boardData, setBoardData] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState({
    piece: "",
    coordinates: [],
  });
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [hasWhiteKingMoved, setHasWhiteKingMoved] = useState(false);
  const [hasRookA1Moved, setHasRookA1Moved] = useState(false);
  const [hasRookH1Moved, setHasRookH1Moved] = useState(false);
  const [hasBlackKingMoved, setHasBlackKingMoved] = useState(false);
  const [hasRookA8Moved, setHasRookA8Moved] = useState(false);
  const [hasRookH8Moved, setHasRookH8Moved] = useState(false);
  const [whiteEnPessant, setWhiteEnPessant] = useState("");
  const [blackEnPessant, setBlackEnPessant] = useState("");
  const [isPromotion, setIsPromotion] = useState(false);
  const [promotionColor, setPromotionColor] = useState("");
  const [promotionSquare, setPromotionSquare] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const thisPieceColor = isWhiteTurn ? "white" : "black";
  const otherColor = isWhiteTurn ? "black" : "white";

  let isForReal = true;
  let otherX = null;
  let otherY = null;

  const getPieceCoordinateX = () =>
    isForReal ? selectedSquare.coordinates[0] : otherX;
  const getPieceCoordinateY = () =>
    isForReal ? selectedSquare.coordinates[1] : otherY;

  const resetBoard = () => {
    const freshBoardData = structuredClone(startingBoardData);
    setBoardData(freshBoardData);
    setSelectedSquare({
      piece: "",
      coordinates: [],
    });
    setHasWhiteKingMoved(false);
    setHasRookA1Moved(false);
    setHasRookH1Moved(false);
    setHasBlackKingMoved(false);
    setHasRookA8Moved(false);
    setHasRookH8Moved(false);
    setIsWhiteTurn(true);
    setWhiteEnPessant("");
    setBlackEnPessant("");
    setIsPromotion(false);
    setPromotionColor("");
    setPromotionSquare("");
    setIsGameOver(false);
    setIsCheck(false);
  };

  // const handlePossibleLegalKnightMoves = (boardDataParam) => {
  //   const newState = [...boardDataParam];

  //   newState.forEach((square) => {
  //     if (
  //       (square.xAxis === getPieceCoordinateX() + 2 &&
  //         (square.yAxis === getPieceCoordinateY() + 1 ||
  //           square.yAxis === getPieceCoordinateY() - 1)) ||
  //       (square.xAxis === getPieceCoordinateX() - 2 &&
  //         (square.yAxis === getPieceCoordinateY() + 1 ||
  //           square.yAxis === getPieceCoordinateY() - 1)) ||
  //       (square.yAxis === getPieceCoordinateY() + 2 &&
  //         (square.xAxis === getPieceCoordinateX() + 1 ||
  //           square.xAxis === getPieceCoordinateX() - 1)) ||
  //       (square.yAxis === getPieceCoordinateY() - 2 &&
  //         (square.xAxis === getPieceCoordinateX() + 1 ||
  //           square.xAxis === getPieceCoordinateX() - 1))
  //     ) {
  //       square.isLegal = true;
  //       square.isMaybeLegal = true; // isMaybeLegal doesn't do anything, just good for debugging during devolpement, will see throughout
  //     }
  //   });

  //   return newState;
  // };

  // const handleKnightObstacles = (boardDataParam) => {
  //   // only knight obstacle is not landing on your own piece, is used in all other piece obstacle handling
  //   const newState = [...boardDataParam];

  //   newState.forEach((square) => {
  //     if (square.isLegal && square.piece.includes(thisPieceColor)) {
  //       square.isLegal = false;
  //     }
  //   });

  //   return newState;
  // };

  const handlePossibleLegalKingMoves = (boardDataParam) => {
    const newState = [...boardDataParam];
    newState.forEach((square) => {
      if (
        // finding all squars around the king, not king's current square.
        (square.xAxis === getPieceCoordinateX() + 1 ||
          square.xAxis === getPieceCoordinateX() ||
          square.xAxis === getPieceCoordinateX() - 1) &&
        (square.yAxis === getPieceCoordinateY() + 1 ||
          square.yAxis === getPieceCoordinateY() ||
          square.yAxis === getPieceCoordinateY() - 1) &&
        !(
          square.xAxis === getPieceCoordinateX() &&
          square.yAxis === getPieceCoordinateY()
        )
      ) {
        square.isLegal = true;
        square.isMaybeLegal = true;
      }
    });

    return newState;
  };

  const isSquareSeen = (
    squareSeenCoordinates,
    colorSeenBy,
    boardToCheck = boardData
  ) => {
    //used for seeing if a king is in check, if a king is walking in to check, or if any relevant castling squares are being seen
    const squareSeenCoordinateX = squareSeenCoordinates[0];
    const squareSeenCoordinateY = squareSeenCoordinates[1];
    // these are different from x and y coordinates of selected square, these are for a specific square checking if it is seen
    const xRightBlocks = [];
    const xLeftBlocks = [];
    const yUpBlocks = [];
    const yDownBlocks = [];
    const upRightBlocks = [];
    const upLeftBlocks = [];
    const downRightBlocks = [];
    const downLeftBlocks = [];

    boardToCheck.forEach((square) => {
      //very similar to rook and bishop obstacles, you have to find the pieces on each digaonl and straight line path
      if (square.piece.includes("piece_")) {
        if (square.xAxis === squareSeenCoordinateX) {
          if (square.yAxis > squareSeenCoordinateY)
            yUpBlocks.push(square.yAxis);
          if (square.yAxis < squareSeenCoordinateY)
            yDownBlocks.push(square.yAxis);
        }
        if (square.yAxis === squareSeenCoordinateY) {
          if (square.xAxis > squareSeenCoordinateX)
            xRightBlocks.push(square.xAxis);
          if (square.xAxis < squareSeenCoordinateX)
            xLeftBlocks.push(square.xAxis);
        }

        const xDiff = square.xAxis - squareSeenCoordinateX;
        const yDiff = square.yAxis - squareSeenCoordinateY;
        if (Math.abs(xDiff) === Math.abs(yDiff)) {
          if (xDiff > 0 && yDiff > 0) upRightBlocks.push(square.xAxis);
          if (xDiff < 0 && yDiff > 0) upLeftBlocks.push(square.xAxis);
          if (xDiff > 0 && yDiff < 0) downRightBlocks.push(square.xAxis);
          if (xDiff < 0 && yDiff < 0) downLeftBlocks.push(square.xAxis);
        }
      }
    });

    return boardToCheck.some((square) => {
      // now check if that nearest piece is the other color and if it's a piece that can see you
      const xDiff = square.xAxis - squareSeenCoordinateX;
      const yDiff = square.yAxis - squareSeenCoordinateY;
      if (!square.piece.includes(colorSeenBy)) return false; // ignore attacks from same color piece

      const isStraightLineAttack =
        (square.piece.includes("rook") || square.piece.includes("queen")) &&
        ((square.xAxis === Math.max(...xLeftBlocks) &&
          square.yAxis === squareSeenCoordinateY) ||
          (square.xAxis === Math.min(...xRightBlocks) &&
            square.yAxis === squareSeenCoordinateY) ||
          (square.yAxis === Math.min(...yUpBlocks) &&
            square.xAxis === squareSeenCoordinateX) ||
          (square.yAxis === Math.max(...yDownBlocks) &&
            square.xAxis === squareSeenCoordinateX));

      const isDiagonalAttack =
        Math.abs(xDiff) === Math.abs(yDiff) &&
        (square.piece.includes("bishop") || square.piece.includes("queen")) &&
        ((square.xAxis === Math.max(...upLeftBlocks) &&
          square.yAxis > squareSeenCoordinateY) ||
          (square.xAxis === Math.min(...upRightBlocks) &&
            square.yAxis > squareSeenCoordinateY) ||
          (square.xAxis === Math.max(...downLeftBlocks) &&
            square.yAxis < squareSeenCoordinateY) ||
          (square.xAxis === Math.min(...downRightBlocks) &&
            square.yAxis < squareSeenCoordinateY));

      const isKnightAttack =
        square.piece.includes("knight") &&
        ((square.xAxis === squareSeenCoordinateX + 2 &&
          (square.yAxis === squareSeenCoordinateY + 1 ||
            square.yAxis === squareSeenCoordinateY - 1)) ||
          (square.xAxis === squareSeenCoordinateX - 2 &&
            (square.yAxis === squareSeenCoordinateY + 1 ||
              square.yAxis === squareSeenCoordinateY - 1)) ||
          (square.yAxis === squareSeenCoordinateY + 2 &&
            (square.xAxis === squareSeenCoordinateX + 1 ||
              square.xAxis === squareSeenCoordinateX - 1)) ||
          (square.yAxis === squareSeenCoordinateY - 2 &&
            (square.xAxis === squareSeenCoordinateX + 1 ||
              square.xAxis === squareSeenCoordinateX - 1)));

      const isKingAttack =
        square.piece.includes("king") &&
        (square.xAxis === squareSeenCoordinateX + 1 ||
          square.xAxis === squareSeenCoordinateX ||
          square.xAxis === squareSeenCoordinateX - 1) &&
        (square.yAxis === squareSeenCoordinateY + 1 ||
          square.yAxis === squareSeenCoordinateY ||
          square.yAxis === squareSeenCoordinateY - 1) &&
        !(
          square.xAxis === squareSeenCoordinateX &&
          square.yAxis === squareSeenCoordinateY
        );

      const isWhitePawnAttack =
        square.piece.includes("pawn-white") &&
        square.yAxis + 1 === squareSeenCoordinateY &&
        Math.abs(square.xAxis - squareSeenCoordinateX) === 1;

      const isBlackPawnAttack =
        square.piece.includes("pawn-black") &&
        square.yAxis - 1 === squareSeenCoordinateY &&
        Math.abs(square.xAxis - squareSeenCoordinateX) === 1;

      return (
        isStraightLineAttack ||
        isDiagonalAttack ||
        isKnightAttack ||
        isKingAttack ||
        isWhitePawnAttack ||
        isBlackPawnAttack
      );
    });
  };

  const handleKingObstacles = (boardDataParam) => {
    const newState = [...boardDataParam];

    newState.forEach((square) => {
      if (square.isLegal) {
        const tempBoardData = structuredClone(newState);
        const kingCurrentSquare = tempBoardData.find(
          (s) =>
            s.xAxis === getPieceCoordinateX() &&
            s.yAxis === getPieceCoordinateY()
        );

        kingCurrentSquare.piece = "";

        if (
          isSquareSeen([square.xAxis, square.yAxis], otherColor, tempBoardData)
        ) {
          square.isLegal = false;
        }
      }
    });

    return handleKnightObstacles(newState, thisPieceColor);
  };

  // const handlePossibleLegalRookMoves = (boardDataParam) => {
  //   const newState = [...boardDataParam];

  //   newState.forEach((square) => {
  //     if (
  //       (square.xAxis === getPieceCoordinateX() ||
  //         square.yAxis === getPieceCoordinateY()) &&
  //       !(
  //         square.xAxis === getPieceCoordinateX() &&
  //         square.yAxis === getPieceCoordinateY()
  //       )
  //     ) {
  //       square.isLegal = true;
  //       square.isMaybeLegal = true;
  //     }
  //   });

  //   return newState;
  // };

  // const handleRookObstacles = (boardDataParam) => {
  //   const newState = [...boardDataParam];
  //   const xRightBlocks = [];
  //   const xLeftBlocks = [];
  //   const yUpBlocks = [];
  //   const yDownBlocks = [];

  //   newState.forEach((square) => {
  //     if (square.isLegal && square.piece.includes("piece__")) {
  //       // these fill with all the position of all pieces on the same straight line paths as the rook
  //       if (square.xAxis === getPieceCoordinateX()) {
  //         if (square.yAxis > getPieceCoordinateY()) {
  //           yUpBlocks.push(square.yAxis);
  //         }
  //         if (square.yAxis < getPieceCoordinateY()) {
  //           yDownBlocks.push(square.yAxis);
  //         }
  //       }
  //       if (square.yAxis === getPieceCoordinateY()) {
  //         if (square.xAxis > getPieceCoordinateX()) {
  //           xRightBlocks.push(square.xAxis);
  //         }
  //         if (square.xAxis < getPieceCoordinateX()) {
  //           xLeftBlocks.push(square.xAxis);
  //         }
  //       }
  //     }
  //   });

  //   newState.forEach((square) => {
  //     // this makes sure the rook doesn't move past the closest piece in each direction
  //     if (
  //       (square.xAxis < Math.max(...xLeftBlocks) &&
  //         square.yAxis === getPieceCoordinateY()) ||
  //       (square.xAxis > Math.min(...xRightBlocks) &&
  //         square.yAxis === getPieceCoordinateY()) ||
  //       (square.yAxis > Math.min(...yUpBlocks) &&
  //         square.xAxis === getPieceCoordinateX()) ||
  //       (square.yAxis < Math.max(...yDownBlocks) &&
  //         square.xAxis === getPieceCoordinateX())
  //     ) {
  //       square.isLegal = false;
  //     }
  //   });
  //   return handleKnightObstacles(newState);
  // };

  // const handlePossibleLegalBishopMoves = (boardDataParam) => {
  //   const newState = [...boardDataParam];

  //   newState.forEach((square) => {
  //     for (let i = 1; i < 8; i++) {
  //       // fill the diagonals with legal
  //       if (
  //         (square.xAxis === getPieceCoordinateX() + i &&
  //           square.yAxis === getPieceCoordinateY() + i) ||
  //         (square.xAxis === getPieceCoordinateX() - i &&
  //           square.yAxis === getPieceCoordinateY() + i) ||
  //         (square.xAxis === getPieceCoordinateX() + i &&
  //           square.yAxis === getPieceCoordinateY() - i) ||
  //         (square.xAxis === getPieceCoordinateX() - i &&
  //           square.yAxis === getPieceCoordinateY() - i)
  //       ) {
  //         square.isLegal = true;
  //         square.isMaybeLegal = true;
  //       }
  //     }
  //   });

  //   return newState;
  // };

  // const handleBishopObstacles = (boardDataParam) => {
  //   // console.log("handleBishopObstacles fired")
  //   const newState = [...boardDataParam];
  //   const upLeftBlocks = [];
  //   const upRightBlocks = [];
  //   const downLeftBlocks = [];
  //   const downRightBlocks = [];

  //   newState.forEach((square) => {
  //     const xDiff = square.xAxis - getPieceCoordinateX();
  //     const yDiff = square.yAxis - getPieceCoordinateY();
  //     // finds obstacles like rooks, but now on diagonals instead of straight line paths
  //     if (
  //       Math.abs(xDiff) === Math.abs(yDiff) &&
  //       square.piece.includes("piece__")
  //     ) {
  //       if (
  //         square.xAxis < getPieceCoordinateX() &&
  //         square.yAxis > getPieceCoordinateY()
  //       ) {
  //         upLeftBlocks.push(square.xAxis);
  //       }
  //       if (
  //         square.xAxis > getPieceCoordinateX() &&
  //         square.yAxis > getPieceCoordinateY()
  //       ) {
  //         upRightBlocks.push(square.xAxis);
  //       }
  //       if (
  //         square.xAxis < getPieceCoordinateX() &&
  //         square.yAxis < getPieceCoordinateY()
  //       ) {
  //         downLeftBlocks.push(square.xAxis);
  //       }
  //       if (
  //         square.xAxis > getPieceCoordinateX() &&
  //         square.yAxis < getPieceCoordinateY()
  //       ) {
  //         downRightBlocks.push(square.xAxis);
  //       }
  //     }
  //   });

  //   newState.forEach((square) => {
  //     // don't move past closest piece on each diagonal, closest piece being the same color is handled with handleKnightObstacles
  //     if (
  //       (square.xAxis < Math.max(...upLeftBlocks) &&
  //         square.yAxis > getPieceCoordinateY()) ||
  //       (square.xAxis > Math.min(...upRightBlocks) &&
  //         square.yAxis > getPieceCoordinateY()) ||
  //       (square.xAxis < Math.max(...downLeftBlocks) &&
  //         square.yAxis < getPieceCoordinateY()) ||
  //       (square.xAxis > Math.min(...downRightBlocks) &&
  //         square.yAxis < getPieceCoordinateY())
  //     ) {
  //       square.isLegal = false;
  //     }
  //   });

  //   return handleKnightObstacles(newState); // if piece is same color don't land on it
  // };

  // const handlePossibleLegalQueenMoves = (boardDataParam) => {
  //   let updatedBoardData = handlePossibleLegalBishopMoves(boardDataParam);
  //   updatedBoardData = handlePossibleLegalRookMoves(updatedBoardData);
  //   return updatedBoardData;
  // };

  // const handleQueenObstacles = (boardDataParam) => {
  //   let updatedBoardData = handleRookObstacles(boardDataParam);
  //   updatedBoardData = handleBishopObstacles(updatedBoardData);
  //   return updatedBoardData;
  // };

  const handlePossibleLegalWhitePawnMoves = (boardDataParam) => {
    //unlike other pieces, pawn's of different color are two seperate pieces because of their directional movement
    // console.log("WhitePawn POSSLEGAL passed in boardData: ", boardDataParam);
    const newState = [...boardDataParam];
    newState.forEach((square) => {
      if (
        (getPieceCoordinateY() + 1 === square.yAxis &&
          getPieceCoordinateX() === square.xAxis) ||
        (getPieceCoordinateY() === 2 && // only adds double just as possible legal if on y == 2
          getPieceCoordinateY() + 2 === square.yAxis &&
          getPieceCoordinateX() === square.xAxis) ||
        (getPieceCoordinateY() + 1 === square.yAxis &&
          getPieceCoordinateX() - 1 === square.xAxis) ||
        (getPieceCoordinateY() + 1 === square.yAxis &&
          getPieceCoordinateX() + 1 === square.xAxis) // always adds diagonal captures as possible legal
      ) {
        square.isLegal = true;
        square.isMaybeLegal = true;
      }
    });
    // console.log("whitePawnPOSSLEGAL newState: ", newState);
    return newState;
  };

  const handleWhitePawnObstacles = (boardDataParam) => {
    let isDoubleJumpedBlocked = false;

    const newState = [...boardDataParam];

    newState.forEach((square) => {
      if (
        square.xAxis === getPieceCoordinateX() &&
        square.piece.includes("piece__") &&
        square.yAxis === 3
      ) {
        isDoubleJumpedBlocked = true;
      }
    });

    newState.forEach((square) => {
      if (
        ((!(
          (
            (square.xAxis === getPieceCoordinateX() - 1 ||
              square.xAxis === getPieceCoordinateX() + 1) &&
            square.yAxis === getPieceCoordinateY() + 1 &&
            square.piece.includes("black")
          ) // checks for diagonal black pieces ina not to keep diagonal captures if possible
        ) &&
          square.xAxis !== getPieceCoordinateX()) ||
          ((square.yAxis === getPieceCoordinateY() + 1 ||
            square.yAxis === getPieceCoordinateY() + 2) &&
            square.xAxis === getPieceCoordinateX() &&
            square.piece.includes("piece__")) ||
          (square.yAxis === 4 &&
            isDoubleJumpedBlocked && //prevents jumping over pieces during double jump
            getPieceCoordinateY() === 2)) &&
        !(
          !isNaN(whiteEnPessant) && //whiteEnPessant is assigned the column's x axis value (a number) when a black pawn double jumps
          square.yAxis === 6 &&
          square.xAxis === whiteEnPessant && // a string wouldn't satisfy this condition either, so !isNaN(whiteEnPessant) isn't technically needed
          (getPieceCoordinateX() === whiteEnPessant + 1 ||
            getPieceCoordinateX() === whiteEnPessant - 1)
        )
      ) {
        square.isLegal = false;
      }
    });

    return newState;
  };

  const handlePossibleLegalBlackPawnMoves = (boardDataParam) => {
    // same thinking as white just different values for different direction
    const newState = [...boardDataParam];

    newState.forEach((square) => {
      if (
        (getPieceCoordinateY() - 1 === square.yAxis &&
          getPieceCoordinateX() === square.xAxis) ||
        (getPieceCoordinateY() === 7 &&
          getPieceCoordinateY() - 2 === square.yAxis &&
          getPieceCoordinateX() === square.xAxis) ||
        (getPieceCoordinateY() - 1 === square.yAxis &&
          getPieceCoordinateX() - 1 === square.xAxis) ||
        (getPieceCoordinateY() - 1 === square.yAxis &&
          getPieceCoordinateX() + 1 === square.xAxis)
      ) {
        square.isLegal = true;
        square.isMaybeLegal = true;
      }
    });

    return newState;
  };

  const handleBlackPawnObstacles = (boardDataParam) => {
    let isDoubleJumpedBlocked = false;

    const newState = [...boardDataParam];
    newState.forEach((square) => {
      if (
        square.xAxis === getPieceCoordinateX() &&
        square.piece.includes("piece__") &&
        square.yAxis === 6
      ) {
        isDoubleJumpedBlocked = true;
      }
    });

    newState.forEach((square) => {
      if (
        ((!(
          (square.xAxis === getPieceCoordinateX() - 1 ||
            square.xAxis === getPieceCoordinateX() + 1) &&
          square.yAxis === getPieceCoordinateY() - 1 &&
          square.piece.includes("white")
        ) &&
          square.xAxis !== getPieceCoordinateX()) ||
          ((square.yAxis === getPieceCoordinateY() - 1 ||
            square.yAxis === getPieceCoordinateY() - 2) &&
            square.xAxis === getPieceCoordinateX() &&
            square.piece.includes("piece__")) ||
          (square.yAxis === 5 &&
            isDoubleJumpedBlocked &&
            getPieceCoordinateY() === 7)) &&
        !(
          !isNaN(blackEnPessant) &&
          square.yAxis === 3 &&
          square.xAxis === blackEnPessant &&
          (getPieceCoordinateX() === blackEnPessant + 1 ||
            getPieceCoordinateX() === blackEnPessant - 1)
        )
      ) {
        square.isLegal = false;
      }
    });

    return newState;
  };

  const handleWhiteShortCastle = (boardDataParam) => {
    // all four possible castleings are their own unique move
    const newState = [...boardDataParam];
    const e1 = boardData.find((square) => square.squareName === "e1");
    const f1 = boardData.find((square) => square.squareName === "f1");
    const g1 = boardData.find((square) => square.squareName === "g1");
    if (
      !(f1.piece.includes("piece__") || g1.piece.includes("piece__")) && // can only castle through a piece, path must be clear
      !isSquareSeen([f1.xAxis, f1.yAxis], "black") && // king can't land on check, move through what would be a check, or castle when being checked
      !isSquareSeen([g1.xAxis, g1.yAxis], "black") &&
      !isSquareSeen([e1.xAxis, e1.yAxis], "black")
    ) {
      newState.forEach((square) => {
        if (square.squareName === "g1") {
          square.isLegal = true; // castling on computers is presented as a horizontal king double jump, the rook will then move automatically when selected
        }
      });
    }

    return newState;
  };

  const handleWhiteLongCastle = (boardDataParam) => {
    const newState = [...boardDataParam];
    const e1 = boardData.find((square) => square.squareName === "e1");
    const d1 = boardData.find((square) => square.squareName === "d1");
    const c1 = boardData.find((square) => square.squareName === "c1");
    const b1 = boardData.find((square) => square.squareName === "b1");
    if (
      !(
        (
          d1.piece.includes("piece__") ||
          c1.piece.includes("piece__") ||
          b1.piece.includes("piece__")
        ) // unique to long castling, the b column square can't have a piece on it, but can be seen by your opponents piece because the king never touches it
      ) &&
      !isSquareSeen([d1.xAxis, d1.yAxis], "black") &&
      !isSquareSeen([c1.xAxis, c1.yAxis], "black") &&
      !isSquareSeen([e1.xAxis, e1.yAxis], "black")
    ) {
      // console.log("LEGAL CASTLE");

      newState.forEach((square) => {
        if (square.squareName === "c1") {
          square.isLegal = true;
        }
      });
    }
    return newState;
  };

  const handleBlackShortCastle = (boardDataParam) => {
    const newState = [...boardDataParam];
    // black castling logic is the same as white, just different squares
    const e8 = boardData.find((square) => square.squareName === "e8");
    const f8 = boardData.find((square) => square.squareName === "f8");
    const g8 = boardData.find((square) => square.squareName === "g8");
    if (
      !(f8.piece.includes("piece__") || g8.piece.includes("piece__")) &&
      !isSquareSeen([f8.xAxis, f8.yAxis], "white") &&
      !isSquareSeen([g8.xAxis, g8.yAxis], "white") &&
      !isSquareSeen([e8.xAxis, e8.yAxis], "white")
    ) {
      newState.forEach((square) => {
        if (square.squareName === "g8") {
          square.isLegal = true;
        }
      });
    }

    return newState;
  };

  const handleBlackLongCastle = (boardDataParam) => {
    const newState = [...boardDataParam];
    const e8 = boardData.find((square) => square.squareName === "e8");
    const d8 = boardData.find((square) => square.squareName === "d8");
    const c8 = boardData.find((square) => square.squareName === "c8");
    const b8 = boardData.find((square) => square.squareName === "b8");
    if (
      !(
        d8.piece.includes("piece__") ||
        c8.piece.includes("piece__") ||
        b8.piece.includes("piece__")
      ) &&
      !isSquareSeen([d8.xAxis, d8.yAxis], "white") &&
      !isSquareSeen([c8.xAxis, c8.yAxis], "white") &&
      !isSquareSeen([e8.xAxis, e8.yAxis], "white")
    ) {
      newState.forEach((square) => {
        if (square.squareName === "c8") {
          square.isLegal = true;
        }
      });
    }

    return newState;
  };

  const makeAllSquaresIllegal = (boardDataParam) => {
    const newState = [...boardDataParam];

    newState.forEach((square) => {
      square.isLegal = false;
      square.isMaybeLegal = false;
    });

    // console.log("makeAllSquaresIllegal updated boardData:", newState);
    return newState; // Return the updated board data
  };

  const handlePromotion = (promotionPiece) => {
    // this is called inside the promotionSelector popup when the user chooses what piece they wan't to promote to
    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        if (square.squareName === promotionSquare) {
          square.piece = promotionPiece;
        }
      });
      return newState;
    });
    setIsPromotion(false);
    setPromotionColor("");
    setPromotionSquare("");
  };

  const handleIsPinnedToKing = (boardDataParam) => {
    const newState = [...boardDataParam];
    // pieces pinned to the king can still move, they just can't move out of the pin
    const xRightBlocks = [];
    const xLeftBlocks = [];
    const yUpBlocks = [];
    const yDownBlocks = [];
    const upRightBlocks = [];
    const upLeftBlocks = [];
    const downRightBlocks = [];
    const downLeftBlocks = [];

    newState.forEach((square) => {
      if (square.piece.includes("piece__")) {
        if (square.xAxis === getPieceCoordinateX()) {
          if (square.yAxis > getPieceCoordinateY())
            yUpBlocks.push(square.yAxis);
          if (square.yAxis < getPieceCoordinateY())
            yDownBlocks.push(square.yAxis);
        }
        if (square.yAxis === getPieceCoordinateY()) {
          if (square.xAxis > getPieceCoordinateX())
            xRightBlocks.push(square.xAxis);
          if (square.xAxis < getPieceCoordinateX())
            xLeftBlocks.push(square.xAxis);
        }

        const xDiff = square.xAxis - getPieceCoordinateX();
        const yDiff = square.yAxis - getPieceCoordinateY();
        if (Math.abs(xDiff) === Math.abs(yDiff)) {
          if (xDiff > 0 && yDiff > 0) upRightBlocks.push(square.xAxis);
          if (xDiff < 0 && yDiff > 0) upLeftBlocks.push(square.xAxis);
          if (xDiff > 0 && yDiff < 0) downRightBlocks.push(square.xAxis);
          if (xDiff < 0 && yDiff < 0) downLeftBlocks.push(square.xAxis);
        }
      }
    });

    const isVerticalPinned =
      newState.some(
        (square) =>
          (square.piece.includes("rook") ||
            (square.piece.includes("queen") &&
              square.piece.includes(otherColor))) &&
          ((square.yAxis === Math.min(...yUpBlocks) &&
            square.xAxis === getPieceCoordinateX()) ||
            (square.yAxis === Math.max(...yDownBlocks) &&
              square.xAxis === getPieceCoordinateX()))
      ) &&
      newState.some(
        (square) =>
          square.piece.includes("king") &&
          square.piece.includes(thisPieceColor) &&
          ((square.yAxis === Math.min(...yUpBlocks) &&
            square.xAxis === getPieceCoordinateX()) ||
            (square.yAxis === Math.max(...yDownBlocks) &&
              square.xAxis === getPieceCoordinateX()))
      );

    // console.log("isVerticalPinned: ", isVerticalPinned, " getPieceCoordinateX(): ", getPieceCoordinateX(), " getPieceCoordinateY(): ", getPieceCoordinateY(), " yUpBlocks: ", yUpBlocks, " yDownBlocks: ", yDownBlocks, " otherColor: ", otherColor, " thisPieceColor: ", thisPieceColor)
    const isHorizontalPinned =
      newState.some(
        (square) =>
          (square.piece.includes("rook") || square.piece.includes("queen")) &&
          square.piece.includes(otherColor) &&
          ((square.xAxis === Math.max(...xLeftBlocks) &&
            square.yAxis === getPieceCoordinateY()) ||
            (square.xAxis === Math.min(...xRightBlocks) &&
              square.yAxis === getPieceCoordinateY()))
      ) &&
      newState.some(
        (square) =>
          square.piece.includes("king") &&
          square.piece.includes(thisPieceColor) &&
          ((square.xAxis === Math.max(...xLeftBlocks) &&
            square.yAxis === getPieceCoordinateY()) ||
            (square.xAxis === Math.min(...xRightBlocks) &&
              square.yAxis === getPieceCoordinateY()))
      );

    const isUpRightDiagonalPinned =
      newState.some((square) => {
        const xDiff = square.xAxis - getPieceCoordinateX();
        const yDiff = square.yAxis - getPieceCoordinateY();
        return (
          Math.abs(xDiff) === Math.abs(yDiff) &&
          (square.piece.includes("bishop") || square.piece.includes("queen")) &&
          square.piece.includes(otherColor) &&
          ((square.xAxis === Math.min(...upRightBlocks) &&
            square.yAxis > getPieceCoordinateY()) ||
            (square.xAxis === Math.max(...downLeftBlocks) &&
              square.yAxis < getPieceCoordinateY()))
        );
      }) &&
      newState.some((square) => {
        const xDiff = square.xAxis - getPieceCoordinateX();
        const yDiff = square.yAxis - getPieceCoordinateY();
        return (
          Math.abs(xDiff) === Math.abs(yDiff) &&
          square.piece.includes("king") &&
          square.piece.includes(thisPieceColor) &&
          ((square.xAxis === Math.min(...upRightBlocks) &&
            square.yAxis > getPieceCoordinateY()) ||
            (square.xAxis === Math.max(...downLeftBlocks) &&
              square.yAxis < getPieceCoordinateY()))
        );
      });

    const isUpLeftDiagonalPinned =
      newState.some((square) => {
        const xDiff = square.xAxis - getPieceCoordinateX();
        const yDiff = square.yAxis - getPieceCoordinateY();
        return (
          Math.abs(xDiff) === Math.abs(yDiff) &&
          (square.piece.includes("bishop") || square.piece.includes("queen")) &&
          square.piece.includes(otherColor) &&
          ((square.xAxis === Math.max(...upLeftBlocks) &&
            square.yAxis > getPieceCoordinateY()) ||
            (square.xAxis === Math.min(...downRightBlocks) &&
              square.yAxis < getPieceCoordinateY()))
        );
      }) &&
      newState.some((square) => {
        const xDiff = square.xAxis - getPieceCoordinateX();
        const yDiff = square.yAxis - getPieceCoordinateY();
        return (
          Math.abs(xDiff) === Math.abs(yDiff) &&
          square.piece.includes("king") &&
          square.piece.includes(thisPieceColor) &&
          ((square.xAxis === Math.max(...upLeftBlocks) &&
            square.yAxis > getPieceCoordinateY()) ||
            (square.xAxis === Math.min(...downRightBlocks) &&
              square.yAxis < getPieceCoordinateY()))
        );
      });

    newState.forEach((square) => {
      const xDiff = square.xAxis - getPieceCoordinateX();
      const yDiff = square.yAxis - getPieceCoordinateY();

      if (
        (isVerticalPinned && square.xAxis !== getPieceCoordinateX()) ||
        (isHorizontalPinned && square.yAxis !== getPieceCoordinateY()) ||
        (isUpRightDiagonalPinned &&
          ((!(xDiff > 0 && yDiff > 0) && !(xDiff < 0 && yDiff < 0)) ||
            !(Math.abs(xDiff) === Math.abs(yDiff)))) ||
        (isUpLeftDiagonalPinned &&
          ((!(xDiff < 0 && yDiff > 0) && !(xDiff > 0 && yDiff < 0)) ||
            !(Math.abs(xDiff) === Math.abs(yDiff))))
      ) {
        square.isLegal = false;
      }
    });

    return newState;
  };

  const handleBlocksCheck = (boardDataParam) => {
    const newState = [...boardDataParam];
    const king = boardData.find((square) =>
      square.piece.includes(isWhiteTurn ? "king-white" : "king-black")
    );

    if (
      isSquareSeen([king?.xAxis, king?.yAxis], isWhiteTurn ? "black" : "white")
    ) {
      // console.log("king is seen");

      newState.forEach((square) => {
        // this part will remove all legal squares that don't block the check, if it's a double check, it will remove all non-king moves
        if (square.isLegal) {
          if (selectedSquare.piece.includes("king")) {
            // if a king is selcted, removing squares that don't block check doesn't make sense, the king itself will just move out of check, handled in handleKingObstacles
            return;
          }
          const tempBoardData = structuredClone(boardData);
          // to see if a square blocks all checks, we need to create a copy of the current position to move the pieces
          const squareMaybeBlocksCheck = tempBoardData.find(
            (blockingSquare) => blockingSquare.squareName === square.squareName
          ); // find the square being tested in the tempBoardData
          squareMaybeBlocksCheck.piece = "piece_"; //this puts a non-specific "piece_" on the square
          if (
            // testing if the addition of a piece on this square blocks the check
            isSquareSeen(
              [king.xAxis, king.yAxis],
              isWhiteTurn ? "black" : "white",
              tempBoardData
            )
          ) {
            square.isLegal = false;
            // when a being placed on this square doesn't block the check, the square becomes an illegal move
          }
        }
      });
    }
    return newState;
  };

  const isNoLegalMoves = () => {
    // console.log("isNoLegalMoves fired");
    isForReal = false;
    let hasAnyLegalMoves = false;
    let checkedBoardData = structuredClone(boardData);
    let kingLegalMoves = [];

    boardData.forEach((square) => {
      checkedBoardData = makeAllSquaresIllegal(checkedBoardData);

      if (square.piece.includes(thisPieceColor)) {
        otherX = square.xAxis;
        otherY = square.yAxis;

        if (square.piece.includes("king")) {
          checkedBoardData = handlePossibleLegalKingMoves(checkedBoardData);
          // const possibleKingMoves = checkedBoardData.filter(
          // (square) => square.isLegal
          // );
          // console.log("possibleKingMoves", possibleKingMoves);
          checkedBoardData = handleKingObstacles(checkedBoardData);
          // const possibleKingMovesAfterObstacles = checkedBoardData.filter(
          //   (square) => square.isLegal
          // );
          // console.log(
          //   "possibleKingMovesAfterObstacles",
          //   possibleKingMovesAfterObstacles
          // );
          // console.log("king checkedBoardData", checkedBoardData);

          kingLegalMoves = checkedBoardData.filter(
            (square) => square.isLegal === true
          );
          // console.log("King's legal moves:", kingLegalMoves);
        }

        if (square.piece.includes("queen")) {
          checkedBoardData = handlePossibleLegalQueenMoves(checkedBoardData, [square.xAxis, square.yAxis]);
          checkedBoardData = handleQueenObstacles(checkedBoardData, [square.xAxis, square.yAxis], thisPieceColor);
        }
        if (square.piece.includes("rook")) {
          checkedBoardData = handlePossibleLegalRookMoves(checkedBoardData, [square.xAxis, square.yAxis]);
          checkedBoardData = handleRookObstacles(checkedBoardData, [square.xAxis, square.yAxis], thisPieceColor);
        }
        if (square.piece.includes("knight")) {
          checkedBoardData = handlePossibleLegalKnightMoves(checkedBoardData, [square.xAxis, square.yAxis]);
          checkedBoardData = handleKnightObstacles(checkedBoardData, thisPieceColor);
        }
        if (square.piece.includes("bishop")) {
          checkedBoardData = handlePossibleLegalBishopMoves(checkedBoardData, [square.xAxis, square.yAxis]);
          checkedBoardData = handleBishopObstacles(checkedBoardData, [square.xAxis, square.yAxis], thisPieceColor);
        }
        if (square.piece.includes("pawn-white")) {
          checkedBoardData =
            handlePossibleLegalWhitePawnMoves(checkedBoardData);
          checkedBoardData = handleWhitePawnObstacles(checkedBoardData);
        }
        if (square.piece.includes("pawn-black")) {
          checkedBoardData =
            handlePossibleLegalBlackPawnMoves(checkedBoardData);
          checkedBoardData = handleBlackPawnObstacles(checkedBoardData);
        }
        checkedBoardData = handleIsPinnedToKing(checkedBoardData);
        checkedBoardData = handleBlocksCheck(checkedBoardData);
        if (
          checkedBoardData.some((square) => {
            return square.isLegal;
          }) ||
          kingLegalMoves.length > 0
        ) {
          hasAnyLegalMoves = true;
        }
      }
    });
    isForReal = true;
    // console.log(
    //   "isWhiteTurn: ",
    //   isWhiteTurn,
    //   "hasAnyLegalMoves",
    //   hasAnyLegalMoves
    // );

    return !hasAnyLegalMoves;
  };

  const isItCheck = () => {
    const king = boardData.find((square) =>
      square.piece.includes(isWhiteTurn ? "king-white" : "king-black")
    );

    return isSquareSeen(
      [king?.xAxis, king?.yAxis],
      isWhiteTurn ? "black" : "white"
    );
  };

  useEffect(() => {
    if (boardData.length > 0) {
      setIsGameOver(isNoLegalMoves());
      setIsCheck(isItCheck());
    }
    // console.log("isGameOver", isGameOver, "isCheck", isCheck);
  }, [isWhiteTurn, isPromotion]);

  const handleLegalMoves = () => {
    let updatedBoardData = structuredClone(boardData); // Start with a copy of the current board data
    updatedBoardData = makeAllSquaresIllegal(updatedBoardData); // Make all squares illegal
    if (
      (selectedSquare.piece.includes("white") && isWhiteTurn) ||
      (selectedSquare.piece.includes("black") && !isWhiteTurn)
    ) {
      if (selectedSquare.piece.includes("king")) {
        updatedBoardData = handlePossibleLegalKingMoves(updatedBoardData);
        updatedBoardData = handleKingObstacles(updatedBoardData);
        if (isWhiteTurn) {
          if (!(hasWhiteKingMoved || hasRookH1Moved)) {
            updatedBoardData = handleWhiteShortCastle(updatedBoardData);
          }
          if (!(hasWhiteKingMoved || hasRookA1Moved)) {
            updatedBoardData = handleWhiteLongCastle(updatedBoardData);
          }
        } else {
          if (!(hasBlackKingMoved || hasRookH8Moved)) {
            updatedBoardData = handleBlackShortCastle(updatedBoardData);
          }
          if (!(hasBlackKingMoved || hasRookA8Moved)) {
            updatedBoardData = handleBlackLongCastle(updatedBoardData);
          }
        }
      } else if (selectedSquare.piece.includes("rook")) {
        updatedBoardData = handlePossibleLegalRookMoves(updatedBoardData, selectedSquare.coordinates);
        updatedBoardData = handleRookObstacles(updatedBoardData, selectedSquare.coordinates, thisPieceColor);
      } else if (selectedSquare.piece.includes("bishop")) {
        updatedBoardData = handlePossibleLegalBishopMoves(updatedBoardData, selectedSquare.coordinates);
        updatedBoardData = handleBishopObstacles(updatedBoardData, selectedSquare.coordinates, thisPieceColor);
      } else if (selectedSquare.piece.includes("queen")) {
        updatedBoardData = handlePossibleLegalQueenMoves(updatedBoardData, selectedSquare.coordinates);
        updatedBoardData = handleQueenObstacles(updatedBoardData, selectedSquare.coordinates, thisPieceColor);
      } else if (selectedSquare.piece.includes("knight")) {
        updatedBoardData = handlePossibleLegalKnightMoves(updatedBoardData, selectedSquare.coordinates);
        updatedBoardData = handleKnightObstacles(updatedBoardData, thisPieceColor);
      } else if (selectedSquare.piece.includes("pawn")) {
        if (isWhiteTurn) {
          updatedBoardData =
            handlePossibleLegalWhitePawnMoves(updatedBoardData);
          updatedBoardData = handleWhitePawnObstacles(updatedBoardData);
        } else {
          updatedBoardData =
            handlePossibleLegalBlackPawnMoves(updatedBoardData);
          updatedBoardData = handleBlackPawnObstacles(updatedBoardData);
        }
      }
      updatedBoardData = handleIsPinnedToKing(updatedBoardData);
      updatedBoardData = handleBlocksCheck(updatedBoardData);
    }
    // console.log("updatedBoardData", updatedBoardData);
    setBoardData(updatedBoardData); // Update the state with the final board data
  };

  const movePiece = (piece, newSquareName, oldSquareCoordinates) => {
    console.log("moved piece: ", piece, newSquareName, oldSquareCoordinates);
    if (piece.includes("king-white")) {
      setHasWhiteKingMoved(true);
    }
    if (piece.includes("king-black")) {
      setHasBlackKingMoved(true);
    }
    if (oldSquareCoordinates[0] === 8 && oldSquareCoordinates[1] === 1) {
      setHasRookH1Moved(true);
    }
    if (oldSquareCoordinates[0] === 1 && oldSquareCoordinates[1] === 1) {
      setHasRookA1Moved(true);
    }
    if (oldSquareCoordinates[0] === 8 && oldSquareCoordinates[1] === 8) {
      setHasRookH8Moved(true);
    }
    if (oldSquareCoordinates[0] === 1 && oldSquareCoordinates[1] === 8) {
      setHasRookA8Moved(true);
    }

    if (
      piece.includes("king-white") &&
      newSquareName === "g1" &&
      oldSquareCoordinates[0] === 5
    ) {
      setBoardData((prevState) => {
        const newState = [...prevState];

        newState.forEach((square) => {
          if (square.squareName === "f1") {
            square.piece = "piece__rook-white";
          }
          if (square.squareName === "h1") {
            square.piece = "";
          }
        });

        return newState;
      });
    }

    if (
      piece.includes("king-white") &&
      newSquareName === "c1" &&
      oldSquareCoordinates[0] === 5
    ) {
      setBoardData((prevState) => {
        const newState = [...prevState];

        newState.forEach((square) => {
          if (square.squareName === "d1") {
            square.piece = "piece__rook-white";
          }
          if (square.squareName === "a1") {
            square.piece = "";
          }
        });

        return newState;
      });
    }

    if (
      piece.includes("king-black") &&
      newSquareName === "g8" &&
      oldSquareCoordinates[0] === 5
    ) {
      setBoardData((prevState) => {
        const newState = [...prevState];

        newState.forEach((square) => {
          if (square.squareName === "f8") {
            square.piece = "piece__rook-black";
          }
          if (square.squareName === "h8") {
            square.piece = "";
          }
        });

        return newState;
      });
    }

    if (
      piece.includes("king-black") &&
      newSquareName === "c8" &&
      oldSquareCoordinates[0] === 5
    ) {
      setBoardData((prevState) => {
        const newState = [...prevState];

        newState.forEach((square) => {
          if (square.squareName === "d8") {
            square.piece = "piece__rook-black";
          }
          if (square.squareName === "a8") {
            square.piece = "";
          }
        });

        return newState;
      });
    }

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        if (square.squareName === newSquareName) {
          square.piece = piece.slice(6);
        }
        if (
          (square.xAxis === oldSquareCoordinates[0] &&
            square.yAxis === oldSquareCoordinates[1]) ||
          (whiteEnPessant ===
            alphabetArray.indexOf(newSquareName.charAt(0)) + 1 &&
            piece.includes("pawn") &&
            oldSquareCoordinates[1] === 5 &&
            (oldSquareCoordinates[0] === whiteEnPessant + 1 ||
              oldSquareCoordinates[0] === whiteEnPessant - 1) &&
            square.xAxis === whiteEnPessant &&
            square.yAxis === 5) ||
          (blackEnPessant ===
            alphabetArray.indexOf(newSquareName.charAt(0)) + 1 &&
            piece.includes("pawn") &&
            oldSquareCoordinates[1] === 4 &&
            (oldSquareCoordinates[0] === blackEnPessant + 1 ||
              oldSquareCoordinates[0] === blackEnPessant - 1) &&
            square.xAxis === blackEnPessant &&
            square.yAxis === 4)
        ) {
          square.piece = "";
        }
      });

      return newState;
    });

    setSelectedSquare({
      piece: "",
      coordinates: [],
    });
    if (isWhiteTurn) {
      setIsWhiteTurn(false);
    } else {
      setIsWhiteTurn(true);
    }
    if (
      oldSquareCoordinates[1] === 2 &&
      piece.includes("pawn") &&
      newSquareName.includes("4")
    ) {
      setBlackEnPessant(oldSquareCoordinates[0]);
    } else {
      setBlackEnPessant("");
    }
    if (
      oldSquareCoordinates[1] === 7 &&
      piece.includes("pawn") &&
      newSquareName.includes("5")
    ) {
      setWhiteEnPessant(oldSquareCoordinates[0]);
    } else {
      setWhiteEnPessant("");
    }
    if (piece.includes("pawn") && newSquareName.includes("8")) {
      setIsPromotion(true);
      setPromotionColor("white");
      setPromotionSquare(newSquareName);
    }
    if (piece.includes("pawn") && newSquareName.includes("1")) {
      setIsPromotion(true);
      setPromotionColor("black");
      setPromotionSquare(newSquareName);
    }
  };

  const handleMouseUp = (event) => {
        // // console.log("MOUSE UP UP - target id:", event.target);
        // const squareData = boardData.find(
        //   (square) => square.squareName === event.target.id.toString()
        // );
        // if (squareData?.isLegal) {
        //   movePiece(
        //     selectedSquare.piece,
        //     squareData.squareName,
        //     selectedSquare.coordinates
        //   );
        // }
        //   //  window.removeEventListener("mouseup", handleMouseUp);

        // const piece = event.target.className;
        // const coordinates = [
        //   alphabetArray.indexOf(event.target.id.charAt(0)) + 1,
        //   Number(event.target.id.charAt(1)),
        // ];
        const squareData = boardData.find(
          (square) => square.squareName === event.target.id.toString()
        );
        // console.log(squareData);
        if (squareData?.isLegal && !isPromotion) {
          // console.log("move Piece fired")
          movePiece(
            selectedSquare.piece,
            squareData.squareName,
            selectedSquare.coordinates
          );

  }};

  const handleMouseDown = (event) => {
    // console.log("MOUSE DOWN - target id:", event.target);
    const piece = event.target.className;
    const coordinates = [
      alphabetArray.indexOf(event.target.id.charAt(0)) + 1,
      Number(event.target.id.charAt(1)),
    ];
    const squareData = boardData.find(
      (square) => square.squareName === event.target.id.toString()
    );
    // console.log(squareData);
    if (squareData?.isLegal && !isPromotion) {
      movePiece(
        selectedSquare.piece,
        squareData.squareName,
        selectedSquare.coordinates
      );
    } else if (!isPromotion) {
      setSelectedSquare({ piece, coordinates });
      // window.addEventListener("mouseup", handleMouseUp);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedSquare, boardData]);

  useEffect(() => {
    handleLegalMoves();
  }, [selectedSquare]);

  useEffect(() => {
    if (shouldReset) {
      resetBoard();
      setShouldReset(false);
    }
  }, [shouldReset]);

  // console.log("isGameOver: ", isGameOver);
  // console.log('isPromotion' , isPromotion);

  return (
    <>
      <div className="board">
        <PromotionSelector
          isOpen={isPromotion}
          color={promotionColor}
          handlePromotion={handlePromotion}
        />
        <GameOverPopup
          isOpen={!isPromotion && isGameOver}
          isCheck={isCheck}
          isWhiteTurn={isWhiteTurn}
          resetBoard={resetBoard}
        />
        <Pieces boardData={boardData} />
        <BoardBackground boardData={boardData} />
      </div>
    </>
  );
}

export default Board;
