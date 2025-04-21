import { useEffect, useState } from "react";
import "./Board.css";
import BoardBackground from "../BoardBackground/BoardBackground";
import Pieces from "../Pieces/Pieces";
import { startingBoardData } from "../../utils/startingBoardData";
import { alphabetArray } from "../../utils/constants";

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
  const [whiteEnPessant, setWhiteEnPessant] = useState(false);
  const [blackEnPessant, setBlackEnPessant] = useState(false);

  const resetBoard = () => {
    console.log("reset board fired");
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
    setWhiteEnPessant(false);
    setBlackEnPessant(false);
  };

  const isSquareSeen = (coordinates, colorSeenBy, boardToCheck = boardData) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];
    const xRightBlocks = [];
    const xLeftBlocks = [];
    const yUpBlocks = [];
    const yDownBlocks = [];
    const upRightBlocks = [];
    const upLeftBlocks = [];
    const downRightBlocks = [];
    const downLeftBlocks = [];

    boardToCheck.forEach((square) => {
      if (square.piece.includes("piece_")) {
        if (square.xAxis === xCoordinate) {
          if (square.yAxis > yCoordinate) yUpBlocks.push(square.yAxis);
          if (square.yAxis < yCoordinate) yDownBlocks.push(square.yAxis);
        }
        if (square.yAxis === yCoordinate) {
          if (square.xAxis > xCoordinate) xRightBlocks.push(square.xAxis);
          if (square.xAxis < xCoordinate) xLeftBlocks.push(square.xAxis);
        }

        const xDiff = square.xAxis - xCoordinate;
        const yDiff = square.yAxis - yCoordinate;
        if (Math.abs(xDiff) === Math.abs(yDiff)) {
          if (xDiff > 0 && yDiff > 0) upRightBlocks.push(square.xAxis);
          if (xDiff < 0 && yDiff > 0) upLeftBlocks.push(square.xAxis);
          if (xDiff > 0 && yDiff < 0) downRightBlocks.push(square.xAxis);
          if (xDiff < 0 && yDiff < 0) downLeftBlocks.push(square.xAxis);
        }
      }
    });

    return boardToCheck.some((square) => {
      const xDiff = square.xAxis - xCoordinate;
      const yDiff = square.yAxis - yCoordinate;
      if (!square.piece.includes(colorSeenBy)) return false;

      const isStraightLineAttack =
        (square.piece.includes("rook") || square.piece.includes("queen")) &&
        ((square.xAxis === Math.max(...xLeftBlocks) &&
          square.yAxis === yCoordinate) ||
          (square.xAxis === Math.min(...xRightBlocks) &&
            square.yAxis === yCoordinate) ||
          (square.yAxis === Math.min(...yUpBlocks) &&
            square.xAxis === xCoordinate) ||
          (square.yAxis === Math.max(...yDownBlocks) &&
            square.xAxis === xCoordinate));

      const isDiagonalAttack =
        Math.abs(xDiff) === Math.abs(yDiff) &&
        (square.piece.includes("bishop") || square.piece.includes("queen")) &&
        ((square.xAxis === Math.max(...upLeftBlocks) &&
          square.yAxis > yCoordinate) ||
          (square.xAxis === Math.min(...upRightBlocks) &&
            square.yAxis > yCoordinate) ||
          (square.xAxis === Math.max(...downLeftBlocks) &&
            square.yAxis < yCoordinate) ||
          (square.xAxis === Math.min(...downRightBlocks) &&
            square.yAxis < yCoordinate));

      const isKnightAttack =
        square.piece.includes("knight") &&
        ((square.xAxis === xCoordinate + 2 &&
          (square.yAxis === yCoordinate + 1 ||
            square.yAxis === yCoordinate - 1)) ||
          (square.xAxis === xCoordinate - 2 &&
            (square.yAxis === yCoordinate + 1 ||
              square.yAxis === yCoordinate - 1)) ||
          (square.yAxis === yCoordinate + 2 &&
            (square.xAxis === xCoordinate + 1 ||
              square.xAxis === xCoordinate - 1)) ||
          (square.yAxis === yCoordinate - 2 &&
            (square.xAxis === xCoordinate + 1 ||
              square.xAxis === xCoordinate - 1)));

      const isKingAttack =
        square.piece.includes("king") &&
        (square.xAxis === xCoordinate + 1 ||
          square.xAxis === xCoordinate ||
          square.xAxis === xCoordinate - 1) &&
        (square.yAxis === yCoordinate + 1 ||
          square.yAxis === yCoordinate ||
          square.yAxis === yCoordinate - 1) &&
        !(square.xAxis === xCoordinate && square.yAxis === yCoordinate);

      const isWhitePawnAttack =
        square.piece.includes("pawn-white") &&
        square.yAxis + 1 === yCoordinate &&
        Math.abs(square.xAxis - xCoordinate) === 1;

      const isBlackPawnAttack =
        square.piece.includes("pawn-black") &&
        square.yAxis - 1 === yCoordinate &&
        Math.abs(square.xAxis - xCoordinate) === 1;

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

  const handleIsPinnedToKing = (coordinates, thisPieceColor) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];
    const otherColor = thisPieceColor === "white" ? "black" : "white";
    const xRightBlocks = [];
    const xLeftBlocks = [];
    const yUpBlocks = [];
    const yDownBlocks = [];
    const upRightBlocks = [];
    const upLeftBlocks = [];
    const downRightBlocks = [];
    const downLeftBlocks = [];

    boardData.forEach((square) => {
      if (square.piece.includes("piece__")) {
        if (square.xAxis === xCoordinate) {
          if (square.yAxis > yCoordinate) yUpBlocks.push(square.yAxis);
          if (square.yAxis < yCoordinate) yDownBlocks.push(square.yAxis);
        }
        if (square.yAxis === yCoordinate) {
          if (square.xAxis > xCoordinate) xRightBlocks.push(square.xAxis);
          if (square.xAxis < xCoordinate) xLeftBlocks.push(square.xAxis);
        }

        const xDiff = square.xAxis - xCoordinate;
        const yDiff = square.yAxis - yCoordinate;
        if (Math.abs(xDiff) === Math.abs(yDiff)) {
          if (xDiff > 0 && yDiff > 0) upRightBlocks.push(square.xAxis);
          if (xDiff < 0 && yDiff > 0) upLeftBlocks.push(square.xAxis);
          if (xDiff > 0 && yDiff < 0) downRightBlocks.push(square.xAxis);
          if (xDiff < 0 && yDiff < 0) downLeftBlocks.push(square.xAxis);
        }
      }
    });

    const isVerticalPinned =
      boardData.some(
        (square) =>
          (square.piece.includes("rook") ||
            (square.piece.includes("queen") &&
              square.piece.includes(otherColor))) &&
          ((square.yAxis === Math.min(...yUpBlocks) &&
            square.xAxis === xCoordinate) ||
            (square.yAxis === Math.max(...yDownBlocks) &&
              square.xAxis === xCoordinate))
      ) &&
      boardData.some(
        (square) =>
          square.piece.includes("king") &&
          square.piece.includes(thisPieceColor) &&
          ((square.yAxis === Math.min(...yUpBlocks) &&
            square.xAxis === xCoordinate) ||
            (square.yAxis === Math.max(...yDownBlocks) &&
              square.xAxis === xCoordinate))
      );

    const isHorizontalPinned =
      boardData.some(
        (square) =>
          (square.piece.includes("rook") || square.piece.includes("queen")) &&
          square.piece.includes(otherColor) &&
          ((square.xAxis === Math.max(...xLeftBlocks) &&
            square.yAxis === yCoordinate) ||
            (square.xAxis === Math.min(...xRightBlocks) &&
              square.yAxis === yCoordinate))
      ) &&
      boardData.some(
        (square) =>
          square.piece.includes("king") &&
          square.piece.includes(thisPieceColor) &&
          ((square.xAxis === Math.max(...xLeftBlocks) &&
            square.yAxis === yCoordinate) ||
            (square.xAxis === Math.min(...xRightBlocks) &&
              square.yAxis === yCoordinate))
      );

    const isUpRightDiagonalPinned =
      boardData.some((square) => {
        const xDiff = square.xAxis - xCoordinate;
        const yDiff = square.yAxis - yCoordinate;
        return (
          Math.abs(xDiff) === Math.abs(yDiff) &&
          (square.piece.includes("bishop") || square.piece.includes("queen")) &&
          square.piece.includes(otherColor) &&
          ((square.xAxis === Math.min(...upRightBlocks) &&
            square.yAxis > yCoordinate) ||
            (square.xAxis === Math.max(...downLeftBlocks) &&
              square.yAxis < yCoordinate))
        );
      }) &&
      boardData.some((square) => {
        const xDiff = square.xAxis - xCoordinate;
        const yDiff = square.yAxis - yCoordinate;
        return (
          Math.abs(xDiff) === Math.abs(yDiff) &&
          square.piece.includes("king") &&
          square.piece.includes(thisPieceColor) &&
          ((square.xAxis === Math.min(...upRightBlocks) &&
            square.yAxis > yCoordinate) ||
            (square.xAxis === Math.max(...downLeftBlocks) &&
              square.yAxis < yCoordinate))
        );
      });

    const isUpLeftDiagonalPinned =
      boardData.some((square) => {
        const xDiff = square.xAxis - xCoordinate;
        const yDiff = square.yAxis - yCoordinate;
        return (
          Math.abs(xDiff) === Math.abs(yDiff) &&
          (square.piece.includes("bishop") || square.piece.includes("queen")) &&
          square.piece.includes(otherColor) &&
          ((square.xAxis === Math.max(...upLeftBlocks) &&
            square.yAxis > yCoordinate) ||
            (square.xAxis === Math.min(...downRightBlocks) &&
              square.yAxis < yCoordinate))
        );
      }) &&
      boardData.some((square) => {
        const xDiff = square.xAxis - xCoordinate;
        const yDiff = square.yAxis - yCoordinate;
        return (
          Math.abs(xDiff) === Math.abs(yDiff) &&
          square.piece.includes("king") &&
          square.piece.includes(thisPieceColor) &&
          ((square.xAxis === Math.max(...upLeftBlocks) &&
            square.yAxis > yCoordinate) ||
            (square.xAxis === Math.min(...downRightBlocks) &&
              square.yAxis < yCoordinate))
        );
      });

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        const xDiff = square.xAxis - xCoordinate;
        const yDiff = square.yAxis - yCoordinate;

        if (
          (isVerticalPinned && square.xAxis !== xCoordinate) ||
          (isHorizontalPinned && square.yAxis !== yCoordinate) ||
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
    });
  };

  const handleIsChecked = (thisPieceColor) => {
    const whiteKing = boardData.find((square) =>
      square.piece.includes("king-white")
    );
    const blackKing = boardData.find((square) =>
      square.piece.includes("king-black")
    );

    if (
      thisPieceColor === "white" &&
      isSquareSeen([whiteKing.xAxis, whiteKing.yAxis], "black")
    ) {
      setBoardData((prevState) => {
        const newState = [...prevState];

        newState.forEach((square) => {
          if (square.isLegal) {
            if (selectedSquare.piece.includes("king")) {
              return;
            }
            const tempBoardData = boardData.map((s) => ({ ...s }));
            const tempSquareIndex =
              tempBoardData[(8 - square.yAxis) * 8 + (square.xAxis - 1)];

            tempSquareIndex.piece = "piece_";
            if (
              isSquareSeen(
                [whiteKing.xAxis, whiteKing.yAxis],
                "black",
                tempBoardData
              )
            ) {
              square.isLegal = false;
            }
          }
        });

        return newState;
      });
    }
    if (
      thisPieceColor === "black" &&
      isSquareSeen([blackKing?.xAxis, blackKing?.yAxis], "white")
    ) {
      setBoardData((prevState) => {
        const newState = [...prevState];

        newState.forEach((square) => {
          if (square.isLegal) {
            if (selectedSquare.piece.includes("king")) {
              return;
            }
            const tempBoardData = boardData.map((s) => ({ ...s }));
            const tempSquareIndex =
              tempBoardData[(8 - square.yAxis) * 8 + (square.xAxis - 1)];

            if (tempSquareIndex) {
              tempSquareIndex.piece = "piece_";

              if (
                isSquareSeen(
                  [blackKing.xAxis, blackKing.yAxis],
                  "white",
                  tempBoardData
                )
              ) {
                square.isLegal = false;
              }
            }
          }
        });

        return newState;
      });
    }
  };

  const handlePossibleLegalKingMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        if (
          (square.xAxis === xCoordinate + 1 ||
            square.xAxis === xCoordinate ||
            square.xAxis === xCoordinate - 1) &&
          (square.yAxis === yCoordinate + 1 ||
            square.yAxis === yCoordinate ||
            square.yAxis === yCoordinate - 1) &&
          !(square.xAxis === xCoordinate && square.yAxis === yCoordinate)
        ) {
          square.isLegal = true;
          square.isMaybeLegal = true;
        }
      });

      return newState;
    });
  };

  const handlePossibleLegalRookMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        if (
          (square.xAxis === xCoordinate || square.yAxis === yCoordinate) &&
          !(square.xAxis === xCoordinate && square.yAxis === yCoordinate)
        ) {
          square.isLegal = true;
          square.isMaybeLegal = true;
        }
      });

      return newState;
    });
  };

  const handlePossibleLegalBishopMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        for (let i = 1; i < 8; i++) {
          if (
            (square.xAxis === xCoordinate + i &&
              square.yAxis === yCoordinate + i) ||
            (square.xAxis === xCoordinate - i &&
              square.yAxis === yCoordinate + i) ||
            (square.xAxis === xCoordinate + i &&
              square.yAxis === yCoordinate - i) ||
            (square.xAxis === xCoordinate - i &&
              square.yAxis === yCoordinate - i)
          ) {
            square.isLegal = true;
            square.isMaybeLegal = true;
          }
        }
      });

      return newState;
    });
  };

  const handlePossibleLegalQueenMoves = (coordinates) => {
    handlePossibleLegalBishopMoves(coordinates);
    handlePossibleLegalRookMoves(coordinates);
  };

  const handlePossibleLegalKnightMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        if (
          (square.xAxis === xCoordinate + 2 &&
            (square.yAxis === yCoordinate + 1 ||
              square.yAxis === yCoordinate - 1)) ||
          (square.xAxis === xCoordinate - 2 &&
            (square.yAxis === yCoordinate + 1 ||
              square.yAxis === yCoordinate - 1)) ||
          (square.yAxis === yCoordinate + 2 &&
            (square.xAxis === xCoordinate + 1 ||
              square.xAxis === xCoordinate - 1)) ||
          (square.yAxis === yCoordinate - 2 &&
            (square.xAxis === xCoordinate + 1 ||
              square.xAxis === xCoordinate - 1))
        ) {
          square.isLegal = true;
          square.isMaybeLegal = true;
        }
      });

      return newState;
    });
  };

  const handlePossibleLegalWhitePawnMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        if (
          (yCoordinate + 1 === square.yAxis && xCoordinate === square.xAxis) ||
          (yCoordinate === 2 &&
            yCoordinate + 2 === square.yAxis &&
            xCoordinate === square.xAxis) ||
          (yCoordinate + 1 === square.yAxis &&
            xCoordinate - 1 === square.xAxis) ||
          (yCoordinate + 1 === square.yAxis && xCoordinate + 1 === square.xAxis)
        ) {
          square.isLegal = true;
          square.isMaybeLegal = true;
        }
      });

      return newState;
    });
  };

  const handlePossibleLegalBlackPawnMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        if (
          (yCoordinate - 1 === square.yAxis && xCoordinate === square.xAxis) ||
          (yCoordinate === 7 &&
            yCoordinate - 2 === square.yAxis &&
            xCoordinate === square.xAxis) ||
          (yCoordinate - 1 === square.yAxis &&
            xCoordinate - 1 === square.xAxis) ||
          (yCoordinate - 1 === square.yAxis && xCoordinate + 1 === square.xAxis)
        ) {
          square.isLegal = true;
          square.isMaybeLegal = true;
        }
      });

      return newState;
    });
  };

  const handleKnightObstacles = (thisPieceColor) => {
    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        if (square.isLegal && square.piece.includes(thisPieceColor)) {
          square.isLegal = false;
        }
      });

      return newState;
    });
  };

  const handleKingObstacles = (thisPieceColor) => {
    handleKnightObstacles(thisPieceColor);

    const otherColor = thisPieceColor === "white" ? "black" : "white";
    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        if (square.isLegal) {
          const tempBoardData = boardData.map((s) => ({ ...s }));
          const kingCurrentSquare = tempBoardData.find(
            (s) =>
              s.xAxis === selectedSquare.coordinates[0] &&
              s.yAxis === selectedSquare.coordinates[1]
          );
          kingCurrentSquare.piece = "";

          if (
            isSquareSeen(
              [square.xAxis, square.yAxis],
              otherColor,
              tempBoardData
            )
          ) {
            square.isLegal = false;
          }
        }
      });

      return newState;
    });
  };

  const handleRookObstacles = (coordinates, thisPieceColor) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];
    setBoardData((prevState) => {
      const newState = [...prevState];
      const xRightBlocks = [];
      const xLeftBlocks = [];
      const yUpBlocks = [];
      const yDownBlocks = [];

      newState.forEach((square) => {
        if (square.isLegal && square.piece.includes("piece__")) {
          if (square.xAxis === xCoordinate) {
            if (square.yAxis > yCoordinate) {
              yUpBlocks.push(square.yAxis);
            }
            if (square.yAxis < yCoordinate) {
              yDownBlocks.push(square.yAxis);
            }
          }
          if (square.yAxis === yCoordinate) {
            if (square.xAxis > xCoordinate) {
              xRightBlocks.push(square.xAxis);
            }
            if (square.xAxis < xCoordinate) {
              xLeftBlocks.push(square.xAxis);
            }
          }
        }
      });

      newState.forEach((square) => {
        if (
          (square.xAxis < Math.max(...xLeftBlocks) &&
            square.yAxis === yCoordinate) ||
          (square.xAxis > Math.min(...xRightBlocks) &&
            square.yAxis === yCoordinate) ||
          (square.yAxis > Math.min(...yUpBlocks) &&
            square.xAxis === xCoordinate) ||
          (square.yAxis < Math.max(...yDownBlocks) &&
            square.xAxis === xCoordinate)
        ) {
          square.isLegal = false;
        }
      });
      handleKnightObstacles(thisPieceColor);

      return newState;
    });
  };

  const handleBishopObstacles = (coordinates, thisPieceColor) => {
    const otherColor = thisPieceColor === "white" ? "black" : "white";
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];
    setBoardData((prevState) => {
      const newState = [...prevState];
      const upLeftBlocks = [];
      const upRightBlocks = [];
      const downLeftBlocks = [];
      const downRightBlocks = [];

      newState.forEach((square) => {
        if (square.isLegal && square.piece.includes("piece__")) {
          if (square.xAxis < xCoordinate && square.yAxis > yCoordinate) {
            upLeftBlocks.push(square.xAxis);
          }
          if (square.xAxis > xCoordinate && square.yAxis > yCoordinate) {
            upRightBlocks.push(square.xAxis);
          }
          if (square.xAxis < xCoordinate && square.yAxis < yCoordinate) {
            downLeftBlocks.push(square.xAxis);
          }
          if (square.xAxis > xCoordinate && square.yAxis < yCoordinate) {
            downRightBlocks.push(square.xAxis);
          }
        }
      });

      newState.forEach((square) => {
        if (
          (square.xAxis < Math.max(...upLeftBlocks) &&
            square.yAxis > yCoordinate) ||
          (square.xAxis > Math.min(...upRightBlocks) &&
            square.yAxis > yCoordinate) ||
          (square.xAxis < Math.max(...downLeftBlocks) &&
            square.yAxis < yCoordinate) ||
          (square.xAxis > Math.min(...downRightBlocks) &&
            square.yAxis < yCoordinate)
        ) {
          square.isLegal = false;
        }
      });

      return newState;
    });
    handleKnightObstacles(thisPieceColor);
  };

  const handleQueenObstacles = (coordinates, thisPieceColor) => {
    handleRookObstacles(coordinates, thisPieceColor);
    handleBishopObstacles(coordinates, thisPieceColor);
  };

  const handleWhitePawnObstacles = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];
    let isDoubleJumpedBlocked = false;

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        if (
          square.xAxis === xCoordinate &&
          square.piece.includes("piece__") &&
          square.yAxis === 3
        ) {
          isDoubleJumpedBlocked = true;
        }
      });

      newState.forEach((square) => {
        if (
          ((!(
            (square.xAxis === xCoordinate - 1 ||
              square.xAxis === xCoordinate + 1) &&
            square.yAxis === yCoordinate + 1 &&
            square.piece.includes("black")
          ) &&
            square.xAxis !== xCoordinate) ||
            ((square.yAxis === yCoordinate + 1 ||
              square.yAxis === yCoordinate + 2) &&
              square.xAxis === xCoordinate &&
              square.piece.includes("piece__")) ||
            (square.yAxis === 4 &&
              isDoubleJumpedBlocked &&
              yCoordinate === 2)) &&
          !(
            whiteEnPessant &&
            square.yAxis === 6 &&
            square.xAxis === whiteEnPessant &&
            (xCoordinate === whiteEnPessant + 1 ||
              xCoordinate === whiteEnPessant - 1)
          )
        ) {
          square.isLegal = false;
        }
      });

      return newState;
    });
  };

  const handleBlackPawnObstacles = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];
    let isDoubleJumpedBlocked = false;

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        if (
          square.xAxis === xCoordinate &&
          square.piece.includes("piece__") &&
          square.yAxis === 6
        ) {
          isDoubleJumpedBlocked = true;
        }
      });

      newState.forEach((square) => {
        if (
          ((!(
            (square.xAxis === xCoordinate - 1 ||
              square.xAxis === xCoordinate + 1) &&
            square.yAxis === yCoordinate - 1 &&
            square.piece.includes("white")
          ) &&
            square.xAxis !== xCoordinate) ||
            ((square.yAxis === yCoordinate - 1 ||
              square.yAxis === yCoordinate - 2) &&
              square.xAxis === xCoordinate &&
              square.piece.includes("piece__")) ||
            (square.yAxis === 5 &&
              isDoubleJumpedBlocked &&
              yCoordinate === 7)) &&
          !(
            blackEnPessant &&
            square.yAxis === 3 &&
            square.xAxis === blackEnPessant &&
            (xCoordinate === blackEnPessant + 1 ||
              xCoordinate === blackEnPessant - 1)
          )
        ) {
          square.isLegal = false;
        }
      });

      return newState;
    });
  };

  const handleWhiteShortCastle = () => {
    const e1 = boardData.find((square) => square.squareName === "e1");
    const f1 = boardData.find((square) => square.squareName === "f1");
    const g1 = boardData.find((square) => square.squareName === "g1");
    if (
      !(f1.piece.includes("piece__") || g1.piece.includes("piece__")) &&
      !isSquareSeen([f1.xAxis, f1.yAxis], "black") &&
      !isSquareSeen([g1.xAxis, g1.yAxis], "black") &&
      !isSquareSeen([e1.xAxis, e1.yAxis], "black")
    ) {
      setBoardData((prevState) => {
        const newState = [...prevState];

        newState.forEach((square) => {
          if (square.squareName === "g1") {
            square.isLegal = true;
          }
        });

        return newState;
      });
    }
  };

  const handleWhiteLongCastle = () => {
    const e1 = boardData.find((square) => square.squareName === "e1");
    const d1 = boardData.find((square) => square.squareName === "d1");
    const c1 = boardData.find((square) => square.squareName === "c1");
    const b1 = boardData.find((square) => square.squareName === "b1");
    if (
      !(
        d1.piece.includes("piece__") ||
        c1.piece.includes("piece__") ||
        b1.piece.includes("piece__")
      ) &&
      !isSquareSeen([d1.xAxis, d1.yAxis], "black") &&
      !isSquareSeen([c1.xAxis, c1.yAxis], "black") &&
      !isSquareSeen([e1.xAxis, e1.yAxis], "black")
    ) {
      console.log("LEGAL CASTLE");
      setBoardData((prevState) => {
        const newState = [...prevState];

        newState.forEach((square) => {
          if (square.squareName === "c1") {
            square.isLegal = true;
          }
        });

        return newState;
      });
    }
  };

  const handleBlackShortCastle = () => {
    const e8 = boardData.find((square) => square.squareName === "e8");
    const f8 = boardData.find((square) => square.squareName === "f8");
    const g8 = boardData.find((square) => square.squareName === "g8");
    if (
      !(f8.piece.includes("piece__") || g8.piece.includes("piece__")) &&
      !isSquareSeen([f8.xAxis, f8.yAxis], "white") &&
      !isSquareSeen([g8.xAxis, g8.yAxis], "white") &&
      !isSquareSeen([e8.xAxis, e8.yAxis], "white")
    ) {
      setBoardData((prevState) => {
        const newState = [...prevState];

        newState.forEach((square) => {
          if (square.squareName === "g8") {
            square.isLegal = true;
          }
        });

        return newState;
      });
    }
  };

  const handleBlackLongCastle = () => {
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
      setBoardData((prevState) => {
        const newState = [...prevState];

        newState.forEach((square) => {
          if (square.squareName === "c8") {
            square.isLegal = true;
          }
        });

        return newState;
      });
    }
  };

  const handleNoLegalMoves = () => {
    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        square.isLegal = false;
        square.isMaybeLegal = false;
      });

      return newState;
    });
  };

  const handleLegalMoves = () => {
    handleNoLegalMoves();
    if (
      (selectedSquare.piece.includes("white") && isWhiteTurn) ||
      (selectedSquare.piece.includes("black") && !isWhiteTurn)
    ) {
      if (selectedSquare.piece.includes("king")) {
        handlePossibleLegalKingMoves(selectedSquare.coordinates);
        if (selectedSquare.piece.includes("white")) {
          handleKingObstacles("white");
          if (!(hasWhiteKingMoved || hasRookH1Moved)) {
            handleWhiteShortCastle();
          }
          if (!(hasWhiteKingMoved || hasRookA1Moved)) {
            handleWhiteLongCastle();
          }
        } else {
          handleKingObstacles("black");
          if (!(hasBlackKingMoved || hasRookH8Moved)) {
            handleBlackShortCastle();
          }
          if (!(hasBlackKingMoved || hasRookA8Moved)) {
            handleBlackLongCastle();
          }
        }
      }
      if (selectedSquare.piece.includes("rook")) {
        handlePossibleLegalRookMoves(selectedSquare.coordinates);
        if (selectedSquare.piece.includes("white")) {
          handleRookObstacles(selectedSquare.coordinates, "white");
        } else {
          handleRookObstacles(selectedSquare.coordinates, "black");
        }
      }
      if (selectedSquare.piece.includes("bishop")) {
        handlePossibleLegalBishopMoves(selectedSquare.coordinates);
        if (selectedSquare.piece.includes("white")) {
          handleBishopObstacles(selectedSquare.coordinates, "white");
        } else {
          handleBishopObstacles(selectedSquare.coordinates, "black");
        }
      }
      if (selectedSquare.piece.includes("queen")) {
        handlePossibleLegalQueenMoves(selectedSquare.coordinates);
        if (selectedSquare.piece.includes("white")) {
          handleQueenObstacles(selectedSquare.coordinates, "white");
        } else {
          handleQueenObstacles(selectedSquare.coordinates, "black");
        }
      }
      if (selectedSquare.piece.includes("knight")) {
        handlePossibleLegalKnightMoves(selectedSquare.coordinates);
        if (selectedSquare.piece.includes("white")) {
          handleKnightObstacles("white");
        } else {
          handleKnightObstacles("black");
        }
      }
      if (selectedSquare.piece.includes("pawn-white")) {
        handlePossibleLegalWhitePawnMoves(selectedSquare.coordinates);
        handleWhitePawnObstacles(selectedSquare.coordinates);
      }
      if (selectedSquare.piece.includes("pawn-black")) {
        handlePossibleLegalBlackPawnMoves(selectedSquare.coordinates);
        handleBlackPawnObstacles(selectedSquare.coordinates);
      }
      if (selectedSquare.piece.includes("white")) {
        handleIsPinnedToKing(selectedSquare.coordinates, "white");
      } else {
        handleIsPinnedToKing(selectedSquare.coordinates, "black");
      }
      if (selectedSquare.piece.includes("white")) {
        handleIsChecked("white");
      } else {
        handleIsChecked("black");
      }
    }
  };
  const movePiece = (piece, newSquareName, oldSquareCoordinates) => {
    // console.log("moved piece: ", piece, oldSquareCoordinates);
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

    if (piece.includes("king-white") && newSquareName === "g1") {
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

    if (piece.includes("king-white") && newSquareName === "c1") {
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

    if (piece.includes("king-black") && newSquareName === "g8") {
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

    if (piece.includes("king-black") && newSquareName === "c8") {
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
      console.log("setBlackEnPessant ran");
    } else {
      setBlackEnPessant(false);
    }

    if (
      oldSquareCoordinates[1] === 7 &&
      piece.includes("pawn") &&
      newSquareName.includes("5")
    ) {
      setWhiteEnPessant(oldSquareCoordinates[0]);
      console.log("setWhiteEnPessant ran");
    } else {
      setWhiteEnPessant(false);
    }
  };

  // const handleMouseUp = (event) => {
  //       // console.log("MOUSE UP UP - target id:", event.target);
  //       const squareData = boardData.find(
  //         (square) => square.squareName === event.target.id.toString()
  //       );
  //       if (squareData?.isLegal) {
  //         movePiece(
  //           selectedSquare.piece,
  //           squareData.squareName,
  //           selectedSquare.coordinates
  //         );
  //       }
  //         //  window.removeEventListener("mouseup", handleMouseUp);

  // };

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
    if (squareData?.isLegal) {
      movePiece(
        selectedSquare.piece,
        squareData.squareName,
        selectedSquare.coordinates
      );
    } else {
      setSelectedSquare({ piece, coordinates });
      // window.addEventListener("mouseup", handleMouseUp);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    // window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      // window.removeEventListener("mouseup", handleMouseUp);
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

  return (
    <>
      <div className="board">
        <Pieces boardData={boardData} />
        <BoardBackground boardData={boardData} />
      </div>
    </>
  );
}

export default Board;
