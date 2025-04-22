import { useCallback, useEffect, useState } from "react";

import "./App.css";
import Board from "./components/Board/Board";
import PromotionSelector from "./components/PromotionSelector/PromotionSelector";
// import { startingBoardData } from "./utils/startingBoardData";

function App() {
  const [shouldReset, setShouldReset] = useState(true);

  const handleReset = () => {
    setShouldReset(true);
  };

  return (
    <>
      <div className="app">
        <button onClick={handleReset}>Reset Game</button>
        {/* <PromotionSelector /> */}
        <div className="app__board">
          <Board shouldReset={shouldReset} setShouldReset={setShouldReset} />

        </div>
      </div>
    </>
  );
}

export default App;
