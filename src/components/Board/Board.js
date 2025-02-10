import React from 'react';
import Square from '../Square/Square';
import './Board.css';

const Board = ({ boardState, handleSquareClick, selectedPosition }) => {
  return (
    <div id="chessboard">
      {boardState.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            piece={piece}
            onClick={handleSquareClick}
            highlight={selectedPosition && selectedPosition.row === rowIndex && selectedPosition.col === colIndex}
          />
        ))
      )}
    </div>
  );
};

export default Board;