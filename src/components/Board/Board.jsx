import { useState } from "react";

import "./Board.css";

function Board() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const alphabetArray = alphabet.split("");
  const whiteBackRankStart = [
    "Rook",
    "Knight",
    "Bishop",
    "Queen",
    "King",
    "Bishop",
    "Knight",
    "Rook",
  ];
  const blackBackRankStart = [
    "Rook",
    "Knight",
    "Bishop",
    "King",
    "Queen",
    "Bishop",
    "Knight",
    "Rook",
  ];
  const [boardData, setBoardData] = useState([]);
 const startingBoardData = [...Array(64)].map(() => ({
    xAxis: 0,
    yAxis: 0,
    squareName: "",
    piece: null,
    pieceColor: null,
    complexion: "light",
  }));

  for (let i = 0; i < 64; i++) {
   startingBoardData[i].xAxis = (i % 8) + 1;
   startingBoardData[i].yAxis = Math.floor(i / 8) + 1;
   if(i % 2 === 0) {
    startingBoardData[i].complexion = "dark"
   }
  }
 startingBoardData.forEach((square) => {
    const squareNameStart = alphabetArray[square.xAxis - 1];
    const squareNameEnd = square.yAxis.toString();
    square.squareName = squareNameStart + squareNameEnd;
  });
  for (let i = 0; i < 8; i++) {
   startingBoardData[i].piece = whiteBackRankStart[i];
   startingBoardData[i + 8].piece = "pawn";
   startingBoardData[i].pieceColor = "white";
   startingBoardData[i + 8].pieceColor = "white";
   startingBoardData[63 - i].pieceColor = "black";
   startingBoardData[55 - i].pieceColor = "black";
   startingBoardData[63 - i].piece = blackBackRankStart[i];
  }

  console.log(startingBoardData);
  return <></>;
}

export default Board;
