import { useState } from "react";

import "./App.css";
import Board from "./components/Board/Board";
function App() {
  const [shouldReset, setShouldReset] = useState(true);

  const handleReset = () => {
    setShouldReset(true);
  };

  return (
    <div className="app">
      <button onClick={handleReset}>Reset Game</button>
      <div className="app__board">
        <Board shouldReset={shouldReset} setShouldReset={setShouldReset} />
      </div>
    </div>
  );
}

export default App;
