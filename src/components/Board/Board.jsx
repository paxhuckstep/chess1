import { useEffect, useState } from "react";

import "./Board.css";
import BoardBackground from "../BoardBackground/BoardBackground";
import Pieces from "../Pieces/Pieces";

function Board() {
  const [boardData, setBoardData] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState({
    piece: "",
    coordinates: [],
  });
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const alphabetArray = alphabet.split("");
  const whiteBackRankStart = [
    "piece__rook-white",
    "piece__knight-white",
    "piece__bishop-white",
    "piece__king-white",
    "piece__queen-white",
    "piece__bishop-white",
    "piece__knight-white",
    "piece__rook-white",
  ];
  const blackBackRankStart = [
    "piece__rook-black",
    "piece__knight-black",
    "piece__bishop-black",
    "piece__queen-black",
    "piece__king-black",
    "piece__bishop-black",
    "piece__knight-black",
    "piece__rook-black",
  ];

  const startingBoardData = [...Array(64)].map(() => ({
    xAxis: 0,
    yAxis: 0,
    squareName: "",
    piece: "",
    complexion: "light",
    isLegal: false,
  }));
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  for (let i = 0; i < 64; i++) {
    startingBoardData[i].xAxis = (i % 8) + 1;
    startingBoardData[i].yAxis = 8 - Math.floor(i / 8);
  }
  startingBoardData.forEach((square) => {
    const squareNameStart = alphabetArray[square.xAxis - 1];
    const squareNameEnd = square.yAxis.toString();
    square.squareName = squareNameStart + squareNameEnd;
    if ((square.xAxis + square.yAxis) % 2 === 0) {
      square.complexion = "dark";
    }
  });
  for (let i = 0; i < 8; i++) {
    startingBoardData[i].piece = blackBackRankStart[i];
    startingBoardData[i + 8].piece = "piece__pawn-black";
    startingBoardData[63 - i].piece = whiteBackRankStart[i];
    startingBoardData[55 - i].piece = "piece__pawn-white";
  }
  //   console.log(startingBoardData);
  ////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setBoardData(startingBoardData);
  }, []);

  useEffect(() => {
    handleLegalMoves();
  }, [selectedSquare]);

  const handleKingLegalMoves = (coordinates) => {
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
        } else {
          square.isLegal = false;
        }
      });

      return newState;
    });
  };

  const handleLegalRookMoves = (coordinates) => {
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
        } else {
          square.isLegal = false;
        }
      });

      return newState;
    });
  };

  const handleLegalBishopMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        square.isLegal = false;
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
          }
        }
      });

      return newState;
    });
  };

  const handleLegalQueenMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        square.isLegal = false;
        for (let i = 1; i < 8; i++) {
          for (let j = 0; j < 4; j++) {
            if (j === 0) {
              if (
                square.xAxis === xCoordinate + i &&
                square.yAxis === yCoordinate + i
              ) {
                square.isLegal = true;
              }
            }
            if (j === 1) {
              if (
                square.xAxis === xCoordinate - i &&
                square.yAxis === yCoordinate + i
              ) {
                square.isLegal = true;
              }
            }
            if (j === 2) {
              if (
                square.xAxis === xCoordinate + i &&
                square.yAxis === yCoordinate - i
              ) {
                square.isLegal = true;
              }
            }
            if (j === 3) {
              if (
                square.xAxis === xCoordinate - i &&
                square.yAxis === yCoordinate - i
              ) {
                square.isLegal = true;
              }
            }
          }
        }
        if (
          (square.xAxis === xCoordinate || square.yAxis === yCoordinate) &&
          !(square.xAxis === xCoordinate && square.yAxis === yCoordinate)
        ) {
          square.isLegal = true;
        }
      });
      return newState;
    });
  };

  const handleLegalKnightMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        square.isLegal = false;
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
        }
      });

      return newState;
    });
  };

  const handleLegalWhitePawnMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        square.isLegal = false;
        if (
          (yCoordinate + 1 === square.yAxis && xCoordinate === square.xAxis) ||
          (yCoordinate === 2 &&
            yCoordinate + 2 === square.yAxis &&
            xCoordinate === square.xAxis)
        ) {
          square.isLegal = true;
        }
      });

      return newState;
    });
  };

  const handleLegalBlackPawnMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      const newState = [...prevState];

      newState.forEach((square) => {
        square.isLegal = false;
        if (
          (yCoordinate - 1 === square.yAxis && xCoordinate === square.xAxis) ||
          (yCoordinate === 7 &&
            yCoordinate - 2 === square.yAxis &&
            xCoordinate === square.xAxis)
        ) {
          square.isLegal = true;
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
      });

      return newState;
    });
  };

  const handleLegalMoves = () => {
    console.log(selectedSquare);
    if (selectedSquare.piece.includes("king")) {
      handleKingLegalMoves(selectedSquare.coordinates);
    }
    if (selectedSquare.piece.includes("rook")) {
      handleLegalRookMoves(selectedSquare.coordinates);
    }
    if (selectedSquare.piece.includes("bishop")) {
      handleLegalBishopMoves(selectedSquare.coordinates);
    }
    if (selectedSquare.piece.includes("queen")) {
      handleLegalQueenMoves(selectedSquare.coordinates);
    }
    if (selectedSquare.piece.includes("knight")) {
      handleLegalKnightMoves(selectedSquare.coordinates);
    }
    if (selectedSquare.piece.includes("pawn-white")) {
      handleLegalWhitePawnMoves(selectedSquare.coordinates);
    }
    if (selectedSquare.piece.includes("pawn-black")) {
      handleLegalBlackPawnMoves(selectedSquare.coordinates);
    }
    if (selectedSquare.piece === "piece ") {
      handleNoLegalMoves();
    }
  };

  useEffect(() => {
    const handleMouseDown = (event) => {
      console.log("MOUSE DOWN - target:", event.target);
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

////branch saved for display only