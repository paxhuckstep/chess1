import {
  alphabetArray,
  blackBackRankStart,
  whiteBackRankStart,
} from "./constants";

export const startingBoardData = [...Array(64)].map(() => ({
  xAxis: 0,
  yAxis: 0,
  squareName: "",
  piece: "",
  complexion: "light",
  isLegal: false,
  isMaybeLegal: false, //delete later
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
  startingBoardData[i].piece = blackBackRankStart[i];
  startingBoardData[i + 8].piece = "piece__pawn-black";
  startingBoardData[63 - i].piece = whiteBackRankStart[i];
  startingBoardData[55 - i].piece = "piece__pawn-white";
  // startingBoardData[55 - i].piece = "piece__pawn-black";
}

startingBoardData[36].piece = "piece__bishop-white";
startingBoardData[33].piece = "piece__pawn-black";
startingBoardData[38].piece = "piece__pawn-white";
