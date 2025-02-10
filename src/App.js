import React, { useState, useEffect } from 'react';
import Board from './components/Board/Board';
import './App.css';

const initialBoardState = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

function App() {
  const [boardState, setBoardState] = useState(initialBoardState);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // No need to call createBoard here as the Board component will handle rendering
  }, [boardState]);

  const handleSquareClick = (row, col) => {
    if (selectedPiece) {
      movePiece(row, col);
    } else {
      selectPiece(row, col);
    }
  };

  const selectPiece = (row, col) => {
    const piece = boardState[row][col];
    if (!piece || !isPlayersTurn(piece)) return;

    setSelectedPiece(piece);
    setSelectedPosition({ row, col });
  };

  const isPlayersTurn = (piece) => {
    const isWhitePiece = piece.charCodeAt(0) < 9818;
    return (currentPlayer === 'white' && isWhitePiece) || (currentPlayer === 'black' && !isWhitePiece);
  };

  const movePiece = (row, col) => {
    if (!selectedPiece) return;

    const fromRow = selectedPosition.row;
    const fromCol = selectedPosition.col;

    if (isValidMove(fromRow, fromCol, row, col)) {
      const newBoardState = [...boardState];
      newBoardState[row][col] = selectedPiece;
      newBoardState[fromRow][fromCol] = '';
      setBoardState(newBoardState);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    }

    clearSelection();
  };

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = boardState[fromRow][fromCol];
    const targetPiece = boardState[toRow][toCol];
    const isWhitePiece = piece.charCodeAt(0) < 9818;

    if (targetPiece && ((isWhitePiece && targetPiece.charCodeAt(0) < 9818) || (!isWhitePiece && targetPiece.charCodeAt(0) >= 9818))) {
      return false;
    }

    switch (piece) {
      case '♙':
      case '♟':
        return isValidPawnMove(fromRow, fromCol, toRow, toCol, isWhitePiece);
      case '♖':
      case '♜':
        return isValidRookMove(fromRow, fromCol, toRow, toCol);
      case '♘':
      case '♞':
        return isValidKnightMove(fromRow, fromCol, toRow, toCol);
      case '♗':
      case '♝':
        return isValidBishopMove(fromRow, fromCol, toRow, toCol);
      case '♕':
      case '♛':
        return isValidQueenMove(fromRow, fromCol, toRow, toCol);
      case '♔':
      case '♚':
        return isValidKingMove(fromRow, fromCol, toRow, toCol);
      default:
        return false;
    }
  };

  const isValidPawnMove = (fromRow, fromCol, toRow, toCol, isWhite) => {
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    if (fromCol === toCol && boardState[toRow][toCol] === '') {
      if (fromRow + direction === toRow) return true;
      if (fromRow === startRow && fromRow + 2 * direction === toRow && boardState[fromRow + direction][fromCol] === '') return true;
    }

    if (Math.abs(fromCol - toCol) === 1 && fromRow + direction === toRow && boardState[toRow][toCol]) return true;

    return false;
  };

  const isValidRookMove = (fromRow, fromCol, toRow, toCol) => {
    return isValidStraightMove(fromRow, fromCol, toRow, toCol);
  };

  const isValidStraightMove = (fromRow, fromCol, toRow, toCol) => {
    if (fromRow !== toRow && fromCol !== toCol) return false;

    if (fromRow === toRow) {
      const step = fromCol < toCol ? 1 : -1;
      for (let col = fromCol + step; col !== toCol; col += step) {
        if (boardState[fromRow][col]) return false;
      }
    } else {
      const step = fromRow < toRow ? 1 : -1;
      for (let row = fromRow + step; row !== toRow; row += step) {
        if (boardState[row][fromCol]) return false;
      }
    }

    return true;
  };

  const isValidKnightMove = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  };

  const isValidBishopMove = (fromRow, fromCol, toRow, toCol) => {
    return isValidDiagonalMove(fromRow, fromCol, toRow, toCol);
  };

  const isValidQueenMove = (fromRow, fromCol, toRow, toCol) => {
    return isValidStraightMove(fromRow, fromCol, toRow, toCol) || isValidDiagonalMove(fromRow, fromCol, toRow, toCol);
  };

  const isValidKingMove = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return rowDiff <= 1 && colDiff <= 1;
  };

  const isValidDiagonalMove = (fromRow, fromCol, toRow, toCol) => {
    if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;

    const rowStep = fromRow < toRow ? 1 : -1;
    const colStep = fromCol < toCol ? 1 : -1;
    let row = fromRow + rowStep;
    let col = fromCol + colStep;

    while (row !== toRow && col !== toCol) {
      if (boardState[row][col]) return false;
      row += rowStep;
      col += colStep;
    }

    return true;
  };

  const isPathBlocked = (fromRow, fromCol, toRow, toCol) => {
    const rowStep = fromRow < toRow ? 1 : -1;
    const colStep = fromCol < toCol ? 1 : -1;
    let row = fromRow + rowStep;
    let col = fromCol + colStep;

    while (row !== toRow || col !== toCol) {
      if (boardState[row][col]) return true;
      row += rowStep;
      col += colStep;
    }

    return false;
  };

  const clearSelection = () => {
    setSelectedPiece(null);
    setSelectedPosition(null);
  };

  return (
    <div>
      <h1>Ajedrez</h1>
      <Board
        boardState={boardState}
        handleSquareClick={handleSquareClick}
        selectedPosition={selectedPosition}
      />
      <div className="message">{message}</div>
      <audio id="moveSound" src="https://www.soundjay.com/button/beep-07.wav" preload="auto"></audio>
      <audio id="captureSound" src="https://www.soundjay.com/misc/sounds/finger-snap-1.mp3" preload="auto"></audio>
    </div>
  );
}

export default App;
