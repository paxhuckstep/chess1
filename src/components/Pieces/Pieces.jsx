import "./Pieces.css";
function Pieces({ boardData }) {
  return (
    <>
      <div className="pieces">
        {boardData.map((square, index) => {
          const pieceClassName = `piece ${square.piece}`;
          return <div key={index} id={square.squareName} className={pieceClassName}></div>;
        })}
      </div>
    </>
  );
}

export default Pieces;
