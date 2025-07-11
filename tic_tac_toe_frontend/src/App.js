import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * MAIN COLORS (from requirements):
 * --primary:   #1976D2
 * --secondary: #FFC107
 * --accent:    #E91E63
 *
 * Theming is handled via App.css; explicit colors are inline for game elements.
 */

const GAME_STATES = {
  HOME: 'HOME',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED'
};

/**
 * Returns "X" or "O" for next player
 * @param {*} board 
 * @returns "X"|"O"
 */
function getNextPlayer(board) {
  const moves = board.filter(Boolean).length;
  return moves % 2 === 0 ? 'X' : 'O';
}

/**
 * Checks if a player has won. Returns "X", "O" or null.
 * @param {*} board - 9 element array
 */
function calculateWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diags
  ];
  for (const [a, b, c] of lines) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }
  return null;
}

/**
 * Checks if the board is fully filled (draw)
 * @param {*} board 
 */
function isBoardFull(board) {
  return board.every(square => square !== null);
}

/**
 * HEADER COMPONENT
 */
function Header() {
  return (
    <h1
      style={{
        letterSpacing: '2px',
        color: "var(--text-primary)",
        fontWeight: 800,
        marginBottom: 8,
        fontSize: "2.8rem"
      }}>
      TIC TAC TOE
    </h1>
  );
}

/**
 * SQUARE COMPONENT - A single cell of the board.
 */
function Square({ value, onClick, disabled }) {
  const colors = {
    X: "#1976D2",
    O: "#E91E63",
    null: "transparent"
  };
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      disabled={disabled || value}
      style={{
        color: value ? colors[value] : "var(--text-primary)",
        background: "var(--bg-primary)",
        border: `2px solid #e9ecef`,
        fontSize: "2.4rem",
        fontWeight: "bold",
        outline: "none",
        cursor: value || disabled ? "default" : "pointer"
      }}
      aria-label={value ? value : "empty"}
    >
      {value}
    </button>
  );
}

/**
 * GAME BOARD COMPONENT
 */
function Board({ board, onSquareClick, gameOver }) {
  return (
    <div className="ttt-board" style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 70px)",
      gridTemplateRows: "repeat(3, 70px)",
      gap: "8px",
      margin: "0 auto"
    }}>
      {board.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onSquareClick(idx)}
          disabled={gameOver}
        />
      ))}
    </div>
  );
}

/**
 * STATUS COMPONENT
 */
function GameStatus({ winner, draw, currentPlayer }) {
  let text, color = "var(--text-primary)";
  if (winner) {
    text = `Player ${winner} wins!`;
    color = winner === "X" ? "#1976D2" : "#E91E63";
  } else if (draw) {
    text = "Draw game!";
    color = "#888";
  } else {
    text = `Player ${currentPlayer}'s turn`;
    color = currentPlayer === "X" ? "#1976D2" : "#E91E63";
  }
  return (
    <div
      style={{
        color,
        fontSize: "1.35rem",
        fontWeight: "700",
        letterSpacing: "1.2px",
        margin: "18px 0 8px 0",
        minHeight: "1.7em"
      }}
      data-testid="status"
    >
      {text}
    </div>
  );
}

/**
 * HOME SCREEN COMPONENT
 */
function Home({ onStart }) {
  return (
    <div>
      <Header />
      <p style={{ color: "#666", marginBottom: "2.5rem" }}><span role="img" aria-label="two players">👤👤</span> Two-player local game</p>
      <button className="ttt-btn ttt-primary" onClick={onStart}>
        Start New Game
      </button>
      <div style={{ fontSize: "1rem", marginTop: "40px", color: "#aaa" }}>
        Minimalistic, light theme &mdash; By KAVIA
      </div>
    </div>
  );
}

/**
 * MAIN APP COMPONENT
 */
// PUBLIC_INTERFACE
function App() {
  // Theme (light only per requirements, but keep toggle for template)
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  // Navigation/game state
  const [screen, setScreen] = useState(GAME_STATES.HOME);
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  // Reset on (re)start
  const startNewGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setDraw(false);
    setScreen(GAME_STATES.PLAYING);
  };

  // Square click handler
  const handleSquareClick = idx => {
    if (winner || board[idx] || draw || screen !== GAME_STATES.PLAYING) return;
    const next = [...board];
    next[idx] = getNextPlayer(board);
    const win = calculateWinner(next);
    setBoard(next);
    if (win) {
      setWinner(win);
      setScreen(GAME_STATES.FINISHED);
    } else if (isBoardFull(next)) {
      setDraw(true);
      setScreen(GAME_STATES.FINISHED);
    }
  };

  // Reset (keep on game page)
  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setDraw(false);
    setScreen(GAME_STATES.PLAYING);
  };

  // Home button (after game)
  const handleGoHome = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setDraw(false);
    setScreen(GAME_STATES.HOME);
  };

  // The actual current player
  const currentPlayer = getNextPlayer(board);

  return (
    <div className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header/nav */}
      <header style={{
        width: "100%",
        padding: "32px 0 12px 0",
        background: "var(--bg-secondary)",
        borderBottom: "1.5px solid #e6e9ed",
        boxShadow: "0 3px 32px 0 rgba(240, 240, 245, .04)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Header />
        </div>
      </header>
      <main style={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* Home Screen */}
        {screen === GAME_STATES.HOME && (
          <Home onStart={startNewGame} />
        )}

        {/* Game Board */}
        {(screen === GAME_STATES.PLAYING || screen === GAME_STATES.FINISHED) && (
          <div>
            <GameStatus winner={winner} draw={draw} currentPlayer={currentPlayer} />
            <Board
              board={board}
              onSquareClick={handleSquareClick}
              gameOver={!!winner || draw}
            />
            <div style={{
              marginTop: "2.2rem",
              display: "flex",
              justifyContent: "center",
              gap: "12px"
            }}>
              <button className="ttt-btn ttt-primary" onClick={handleRestart}>Restart</button>
              <button className="ttt-btn ttt-secondary" onClick={handleGoHome}>Exit</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
