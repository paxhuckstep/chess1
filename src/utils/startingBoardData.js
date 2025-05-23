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

// startingBoardData[36].piece = "piece__queen-black";

// startingBoardData[42].piece = "piece__knight-black";
// startingBoardData[38].piece = "piece__bishop-white";
// startingBoardData[41].piece = "piece__rook-black";
// startingBoardData[43].piece = "piece__pawn-white";

// startingBoardData[18].piece = "piece__queen-white";
// startingBoardData[20].piece = "piece__pawn-black";
// startingBoardData[21].piece = "piece__pawn-white";
// startingBoardData[25].piece = "piece__pawn-black";
// startingBoardData[43].piece = "piece__pawn-white";


////////////////////////////////////////////////////
// for testing promotion checkmates :

// startingBoardData[4].piece = "";
// startingBoardData[5].piece = "piece__bishop-white";
// startingBoardData[12].piece = "piece__pawn-white"
// startingBoardData[28].piece = "piece__rook-white";
// startingBoardData[10].piece = "piece__knight-white";
// startingBoardData[11].piece = "piece__knight-white";
// startingBoardData[6].piece = "piece__knight-white";
// startingBoardData[3].piece = "piece__knight-white";
// startingBoardData[33].piece = "piece__king-black";
