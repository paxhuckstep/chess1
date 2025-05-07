import { useEffect, useState } from "react";
import "./GameOverPopup.css";
function GameOverPopup({ isOpen, isInCheck, isWhiteTurn, resetBoard }) {
  const [isClosed, setIsClosed] = useState(false);

  const endTypeText = isInCheck
    ? isWhiteTurn
      ? "Black wins!"
      : "White wins!"
    : "Stalemate!";

  const closePopup = () => {
    setIsClosed(true);
    console.log("closePopup Ran, isClosed: ", isClosed);
  };

  useEffect(() => {
    setIsClosed(false);
  }, [isOpen]);

  if (!isOpen || isClosed) return null;

  return (
    <div className="game-over">
      <button onClick={closePopup} className="game-over__close">
        X
      </button>
      <h1 className="game-over__title">Game Over</h1>
      <h2 className="game-over__sub-title">{endTypeText}</h2>
      <button onClick={resetBoard} className="game-over__reset">
        Play Again?
      </button>
    </div>
  );
}

export default GameOverPopup;
