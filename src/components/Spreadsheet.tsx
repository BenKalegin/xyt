import React, { useState } from 'react';
import './Spreadsheet.css';

const ROWS = 10;
const COLS = 10;

const Spreadsheet: React.FC = () => {
    const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        setSelectedCell((prev) => {
            let { row, col } = prev;
            switch (e.key) {
                case 'ArrowUp':
                    row = Math.max(row - 1, 0);
                    break;
                case 'ArrowDown':
                    row = Math.min(row + 1, ROWS - 1);
                    break;
                case 'ArrowLeft':
                    col = Math.max(col - 1, 0);
                    break;
                case 'ArrowRight':
                    col = Math.min(col + 1, COLS - 1);
                    break;
            }
            return { row, col };
        });
    };

    return (
        <div
            className="spreadsheet-grid"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {Array.from({ length: ROWS }).map((_, row) => (
                <div className="row" key={row}>
                    {Array.from({ length: COLS }).map((_, col) => (
                        <div
                            key={col}
                            className={`cell ${
                                selectedCell.row === row && selectedCell.col === col
                                    ? 'selected'
                                    : ''
                            }`}
                        >
                            {row},{col}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Spreadsheet;
