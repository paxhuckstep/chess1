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
  const [hasWhiteKingMoved, setHasWhiteKingMoved] = useState(false);
  const [hasRookA1Moved, setHasRookA1Moved] = useState(false);
  const [hasRookH1Moved, setHasRookH1Moved] = useState(false);
  const [hasBlackKingMoved, setHasBlackKingMoved] = useState(false);
  const [hasRookA8Moved, setHasRookA8Moved] = useState(false);
  const [hasRookH8Moved, setHasRookH8Moved] = useState(false);

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
        if (square.isLegal && square.piece.includes("piece__")) {
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
      // console.log(isDoubleJumpedBlocked);

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
          (square.yAxis === 4 && isDoubleJumpedBlocked && yCoordinate === 2)
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
      // console.log(isDoubleJumpedBlocked);

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
          (square.yAxis === 5 && isDoubleJumpedBlocked && yCoordinate === 7)
        ) {
          square.isLegal = false;
        }
      });

      return newState;
    });
  };

  const handleWhiteShortCastle = () => {
    const f1 = boardData.find((square) => square.squareName === "f1");
    const g1 = boardData.find((square) => square.squareName === "g1");
    if (!(f1.piece.includes("piece__") || g1.piece.includes("piece__"))) {
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
    const d1 = boardData.find((square) => square.squareName === "d1");
    const c1 = boardData.find((square) => square.squareName === "c1");
    const b1 = boardData.find((square) => square.squareName === "b1");
    console.log(f1.piece);
    if (
      !(
        d1.piece.includes("piece__") ||
        c1.piece.includes("piece__") ||
        b1.piece.includes("piece__")
      )
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
    const f8 = boardData.find((square) => square.squareName === "f8");
    const g8 = boardData.find((square) => square.squareName === "g8");
    if (!(f8.piece.includes("piece__") || g8.piece.includes("piece__"))) {
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
    const d8 = boardData.find((square) => square.squareName === "d8");
    const c8 = boardData.find((square) => square.squareName === "c8");
    const b8 = boardData.find((square) => square.squareName === "b8");
    console.log(f1.piece);
    if (
      !(
        d8.piece.includes("piece__") ||
        c8.piece.includes("piece__") ||
        b8.piece.includes("piece__")
      )
    ) {
      console.log("LEGAL CASTLE");
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
    // console.log(selectedSquare);
    handleNoLegalMoves();
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
  };

  const movePiece = (piece, newSquareName, oldSquareCoordinates) => {
    console.log("moved piece: ", piece, oldSquareCoordinates);
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
          square.xAxis === oldSquareCoordinates[0] &&
          square.yAxis === oldSquareCoordinates[1]
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
  };

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
    console.log(squareData);
    if (squareData?.isLegal) {
      movePiece(
        selectedSquare.piece,
        squareData.squareName,
        selectedSquare.coordinates
      );
    } else {
      setSelectedSquare({ piece, coordinates });
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    // window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      // window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedSquare]);

  useEffect(() => {
    resetBoard();
  }, []);

  useEffect(() => {
    handleLegalMoves();
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
