import { useEffect, useState } from "react";

import "./Board.css";
import BoardBackground from "../BoardBackground/BoardBackground";
import Pieces from "../Pieces/Pieces";
import { startingBoardData } from "../../utils/startingBoardData";
import { alphabetArray } from "../../utils/constants";

function Board() {
  const [boardData, setBoardData] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState({
    piece: "",
    coordinates: [],
  });
  useEffect(() => {
    resetBoard();
  }, []);

  useEffect(() => {
    handleLegalMoves();
  }, [selectedSquare]);

  const resetBoard = () => {
    setBoardData(startingBoardData);
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
  };

  const handleRookObstacles = (coordinates, thisPieceColor) => {
    const otherColor = thisPieceColor === "white" ? "black" : "white";
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];
    setBoardData((prevState) => {
      const newState = [...prevState];
      const xRightBlocks = [];
      const xLeftBlocks = [];
      const yUpBlocks = [];
      const yDownBlocks = [];

      newState.forEach((square) => {
        if (square.isLegal && square.piece.length > 0) {
          // console.log(square);
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

      newState.forEach((sqaure) => {
        if (
          !(
            (sqaure.xAxis === Math.max(...xLeftBlocks) ||
              sqaure.xAxis === Math.min(...xRightBlocks) ||
              sqaure.yAxis === Math.min(...yUpBlocks) ||
              sqaure.yAxis === Math.max(...yDownBlocks)) &&
            sqaure.piece.includes(otherColor) &&
            sqaure.isLegal
          ) &&
          ((sqaure.xAxis <= Math.max(...xLeftBlocks) &&
            sqaure.yAxis === yCoordinate) ||
            (sqaure.xAxis >= Math.min(...xRightBlocks) &&
              sqaure.yAxis === yCoordinate) ||
            (sqaure.yAxis >= Math.min(...yUpBlocks) &&
              sqaure.xAxis === xCoordinate) ||
            (sqaure.yAxis <= Math.max(...yDownBlocks) &&
              sqaure.xAxis === xCoordinate))
        ) {
          sqaure.isLegal = false;
        }
      });

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
        if (square.isLegal && square.piece.length > 0) {
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

      newState.forEach((sqaure) => {
        if (
          !(
            ((sqaure.xAxis === Math.max(...upLeftBlocks) &&
              sqaure.yAxis > yCoordinate) ||
              (sqaure.xAxis === Math.min(...upRightBlocks) &&
                sqaure.yAxis > yCoordinate) ||
              (sqaure.xAxis === Math.max(...downLeftBlocks) &&
                sqaure.yAxis < yCoordinate) ||
              (sqaure.xAxis === Math.min(...downRightBlocks) &&
                sqaure.yAxis < yCoordinate)) &&
            sqaure.piece.includes(otherColor) &&
            sqaure.isLegal
          ) &&
          ((sqaure.xAxis <= Math.max(...upLeftBlocks) &&
            sqaure.yAxis > yCoordinate) ||
            (sqaure.xAxis >= Math.min(...upRightBlocks) &&
              sqaure.yAxis > yCoordinate) ||
            (sqaure.xAxis <= Math.max(...downLeftBlocks) &&
              sqaure.yAxis < yCoordinate) ||
            (sqaure.xAxis >= Math.min(...downRightBlocks) &&
              sqaure.yAxis < yCoordinate))
        ) {
          sqaure.isLegal = false;
        }
      });

      return newState;
    });
  };

  const handleQueenObstacles = (coordinates, thisPieceColor) => {
    handleRookObstacles(coordinates, thisPieceColor);
    handleBishopObstacles(coordinates, thisPieceColor);
  };

  const handleWhitePawnObstacles = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];
    setBoardData((prevState) => {
      const newState = [...prevState];
      const doubleJumpBlock = [];

      newState.forEach((square) => {
        if (
          square.xAxis === xCoordinate &&
          square.piece.length > 0 &&
          square.yAxis === 3
        ) {
          doubleJumpBlock.push(square.xAxis);
        }
      });
      // console.log(doubleJumpBlock);

      newState.forEach((square) => {
        if (
          (!(
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
            doubleJumpBlock[0] === square.xAxis &&
            yCoordinate === 2)
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
    setBoardData((prevState) => {
      const newState = [...prevState];
      const doubleJumpBlock = [];

      newState.forEach((square) => {
        if (
          square.xAxis === xCoordinate &&
          square.piece.length > 0 &&
          square.yAxis === 6
        ) {
          doubleJumpBlock.push(square.xAxis);
        }
      });
      // console.log(doubleJumpBlock);

      newState.forEach((square) => {
        if (
          (!(
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
            doubleJumpBlock[0] === square.xAxis &&
            yCoordinate === 7)
        ) {
          square.isLegal = false;
        }
      });

      return newState;
    });
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
    // console.log(selectedSquare);
    handleNoLegalMoves();
    if (selectedSquare.piece.includes("king")) {
      handlePossibleLegalKingMoves(selectedSquare.coordinates);
      if (selectedSquare.piece.includes("white")) {
        handleKingObstacles("white");
      } else {
        handleKingObstacles("black");
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
  };

  useEffect(() => {
    const handleMouseDown = (event) => {
      // console.log("MOUSE DOWN - target:", event.target);
      const piece = event.target.className;
      const coordinates = [
        alphabetArray.indexOf(event.target.id.charAt(0)) + 1,
        Number(event.target.id.charAt(1)),
      ];
      setSelectedSquare({ piece, coordinates });
    };

    // const handleMouseUp = (event) => {
    //   // console.log("MOUSE UP - target:", event.target);
    //   // console.log("mouse UPP!!")
    //   const targetSquare = event.target.closest(".piece");
    //   // if (selectedSquare && targetSquare) {
    //   //   console.log("Move from piece:", selectedSquare, "to:", targetSquare);
    //   // Here you can implement your move logic
    //   // }
    //   setSelectedSquare(null);
    // };

    window.addEventListener("mousedown", handleMouseDown);
    // window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      // window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedSquare]);

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
