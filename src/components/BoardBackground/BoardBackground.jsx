import "./BoardBackground.css";
function BoardBackground({ boardData }) {
  return (
    <>
      <div className="board-background">
        {boardData.map((square, index) => {
          const squareClassName = `board-background__square ${
            square.complexion === "dark"
              ? "board-background__square_dark"
              : "board-background__square_light"
          } ${square.isLegal ? "board-background__square_legal" : ""}`;
          if (square.squareName === "a1") {
            return (
              <div key={index} className={squareClassName}>
                {square.squareName}
              </div>
            );
          }
          if (square.xAxis === 1) {
            return (
              <div key={index} className={squareClassName}>
                {square.squareName.charAt(1)}
              </div>
            );
          }
          if (square.yAxis === 1) {
            return (
              <div key={index} className={squareClassName}>
                {square.squareName.charAt(0)}
              </div>
            );
          }
          return <div key={index} className={squareClassName}></div>;
        })}
      </div>
    </>
  );
}

export default BoardBackground;
