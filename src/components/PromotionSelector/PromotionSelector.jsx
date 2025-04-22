import "./PromotionSelector.css";
function PromotionSelector({ isOpen, color, handlePromotion }) {
  //   console.log("isOpen: ", xisOpen);
  //   console.log("xcolor: ".xcolor);
  //   const isOpen = false;
  if (!isOpen) {
    return null;
  }
  //   const color = "black";
  if (color === "white") {
    return (
      <>
        <div className="selector">
          <button
            onClick={() => {
              handlePromotion("piece__queen-white");
            }}
            className="selector__button selector__button_queen-white"
          ></button>
          <button
            onClick={() => {
              handlePromotion("piece__knight-white");
            }}
            className="selector__button selector__button_knight-white"
          ></button>
          <button
            onClick={() => {
              handlePromotion("piece__rook-white");
            }}
            className="selector__button selector__button_rook-white"
          ></button>
          <button
            onClick={() => {
              handlePromotion("piece__bishop-white");
            }}
            className="selector__button selector__button_bishop-white"
          ></button>
        </div>
      </>
    );
  } else if (color === "black") {
    return (
      <>
        <div className="selector">
          <button
            onClick={() => {
              handlePromotion("piece__queen-black");
            }}
            className="selector__button selector__button_queen-black"
          ></button>
          <button
            onClick={() => {
              handlePromotion("piece__knight-black");
            }}
            className="selector__button selector__button_knight-black"
          ></button>
          <button
            onClick={() => {
              handlePromotion("piece__rook-black");
            }}
            className="selector__button selector__button_rook-black"
          ></button>
          <button
            onClick={() => {
              handlePromotion("piece__bishop-black");
            }}
            className="selector__button selector__button_bishop-black"
          ></button>
        </div>
      </>
    );
  }
}

export default PromotionSelector;
