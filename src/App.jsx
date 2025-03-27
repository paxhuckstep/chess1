import { useState } from "react";

import "./App.css";
import Board from "./components/Board/Board";

function App() {
  return (
    <>
      <div className="app">
        <div className="app__board">
          <Board />
        </div>
      </div>
    </>
  );
}

export default App;
