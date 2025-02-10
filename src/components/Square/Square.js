import React from 'react';
import './Square.css';

const Square = ({ row, col, piece, onClick, highlight }) => {
  const className = `square ${highlight ? 'highlight' : ''} ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
  return (
    <div className={className} onClick={() => onClick(row, col)}>
      {piece && <span className="piece">{piece}</span>}
    </div>
  );
};

export default Square;