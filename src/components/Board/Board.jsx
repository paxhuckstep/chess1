import { useEffect, useState } from "react";

import "./Board.css";
import BoardBackground from "../BoardBackground/BoardBackground";
import Pieces from "../Pieces/Pieces";

function Board() {
  const [boardData, setBoardData] = useState([]);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const alphabetArray = alphabet.split("");
  const whiteBackRankStart = [
    "piece__rook-white",
    "piece__knight-white",
    "piece__bishop-white",
    "piece__queen-white",
    "piece__king-white",
    "piece__bishop-white",
    "piece__knight-white",
    "piece__rook-white",
  ];
  const blackBackRankStart = [
    "piece__rook-black",
    "piece__knight-black",
    "piece__bishop-black",
    "piece__king-black",
    "piece__queen-black",
    "piece__nishop-black",
    "piece__knight-black",
    "piece__rook-black",
  ];

  const startingBoardData = [...Array(64)].map(() => ({
    xAxis: 0,
    yAxis: 0,
    squareName: "",
    piece: "",
    complexion: "light",
  }));

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
    startingBoardData[i].piece = whiteBackRankStart[i];
    startingBoardData[i + 8].piece = "piece__pawn-black";
    startingBoardData[63 - i].piece = blackBackRankStart[i];
    startingBoardData[55 - i].piece = "piece__pawn-white";
  }
  console.log(startingBoardData);
  useEffect(() => {
    setBoardData(startingBoardData);
    console.log(boardData);
  }, []);

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
