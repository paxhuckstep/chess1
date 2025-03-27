import "./Pieces.css";
function Pieces({ boardData }) {
  return (
    <>
      <div className="pieces">
        {boardData.map((square, index) => {
          const pieceClassName =`piece ${square.piece}`;

          if (!square.piece) {
            console.log(square.piece);
            return <div className="piece"></div>;
          }
          return <div className={pieceClassName}></div>;
        })}
      </div>
    </>
  );
}

export default Pieces;
