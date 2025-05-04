import "./GameOverPopup.css";
function GameOverPopup({ isOpen, isInCheck, isWhiteTurn, resetBoard }) {
  if (!isOpen) return null;

  const endTypeText = isInCheck
    ? isWhiteTurn
      ? "Black wins!"
      : "White wins!"
    : "Stalemate!";

  return (
    <div className="game-over">
      <h1 className="game-over__title">Game Over</h1>
      <h2 className="game-over__sub-title">{endTypeText}</h2>
      <button onClick={resetBoard} className="game-over__reset">
        Play Again?
      </button>
    </div>
  );
}

export default GameOverPopup;
