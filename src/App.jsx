import { useState } from 'react'

import './App.css'
import Board from './components/Board/Board'

function App() {

  return (
    <><div className="app">
    <p className="deletable">Wow such empty</p>
    <Board/>
    </div>
    </>
  )
}

export default App
