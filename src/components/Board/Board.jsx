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
    // console.log(selectedSquare);
    handleLegalMoves(selectedSquare);
  }, [selectedSquare]);

  // const handleKingLegalMoves = (coordinates) => {
  //   const xCoordinate = coordinates[0];
  //   const yCoordinate = coordinates[1];
  //   setBoardData((prev) => {
  //     prev.forEach((square) => {
  //       if (
  //         (square.xAxis === xCoordinate + 1 ||
  //           square.xAxis === xCoordinate ||
  //           square.xAxis === xCoordinate - 1) &&
  //         (square.yAxis === yCoordinate + 1 ||
  //           square.yAxis === yCoordinate ||
  //           square.yAxis === yCoordinate - 1)
  //       ) {
  //         square.isLegal = true;
  //       }
  //     });
  //   });
  //   console.log(boardData)
  // };

  const handleKingLegalMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      // Create a copy of the previous state
      const newState = [...prevState];

      // Your existing forEach logic here to modify newState.squares
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
          console.log("should be true: ", square.squareName);
          square.isLegal = true;
        } else {
          square.isLegal = false;
        }
      });

      console.log(newState); // For debugging
      return newState; // This is the crucial line that was missing!
    });
  };

  const handleLegalRookMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      // Create a copy of the previous state
      const newState = [...prevState];

      // Your existing forEach logic here to modify newState.squares
      newState.forEach((square) => {
        if (
          (square.xAxis === xCoordinate || square.yAxis === yCoordinate) &&
          !(square.xAxis === xCoordinate && square.yAxis === yCoordinate)
        ) {
          console.log("should be true: ", square.squareName);
          square.isLegal = true;
        } else {
          square.isLegal = false;
        }
      });

      console.log(newState); // For debugging
      return newState; // This is the crucial line that was missing!
    });
  };

  const handleLegalBishopMoves = (coordinates) => {
    const xCoordinate = coordinates[0];
    const yCoordinate = coordinates[1];

    setBoardData((prevState) => {
      // Create a copy of the previous state
      const newState = [...prevState];

      // Your existing forEach logic here to modify newState.squares
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
      });

      console.log(newState); // For debugging
      return newState; // This is the crucial line that was missing!
    });
  };

  const handleLegalMoves = () => {
    console.log(selectedSquare.piece.includes("king"));
    if (selectedSquare.piece.includes("king")) {
      handleKingLegalMoves(selectedSquare.coordinates);
    }
    if (selectedSquare.piece.includes("rook")) {
      handleLegalRookMoves(selectedSquare.coordinates);
    }
    if (selectedSquare.piece.includes("bishop")) {
      handleLegalBishopMoves(selectedSquare.coordinates);
    }
  };

  useEffect(() => {
    const handleMouseDown = (event) => {
      console.log("MOUSE DOWN - target:", event.target);
      const piece = event.target.className.slice(6);
      const coordinates = [
        alphabetArray.indexOf(event.target.id.charAt(0)) + 1,
        Number(event.target.id.charAt(1)),
      ];
      if (piece.includes("piece_")) {
        // console.log("Starting piece:", piece);
        // console.log("Starting coords: ", coordinates);
        // setSelectedSquare({piece: piece, coordinates: coordinates});
        setSelectedSquare({ piece, coordinates });
      }
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

    // Add event listeners
    window.addEventListener("mousedown", handleMouseDown);
    // window.addEventListener("mouseup", handleMouseUp);

    // Cleanup function
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      // window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedSquare]); // Empty dependency array

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
