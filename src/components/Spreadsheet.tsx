import React, { useEffect, useRef, useState } from 'react';
import './Spreadsheet.css';

const VISIBLE_ROWS = 20;
const VISIBLE_COLS = 10;
const MAX_ROWS = 64536;
const MAX_COLS = 16384;

const Spreadsheet: React.FC = () => {
    const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
    const [viewport, setViewport] = useState({ startRow: 0, startCol: 0 });
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.focus();
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        setSelectedCell((prev) => {
            let { row, col } = prev;
            switch (e.key) {
                case 'ArrowUp':
                    row = Math.max(row - 1, 0);
                    break;
                case 'ArrowDown':
                    row = Math.min(row + 1, MAX_ROWS - 1);
                    break;
                case 'ArrowLeft':
                    col = Math.max(col - 1, 0);
                    break;
                case 'ArrowRight':
                    col = Math.min(col + 1, MAX_COLS - 1);
                    break;
            }
            const startRow = Math.min(Math.max(viewport.startRow, row - VISIBLE_ROWS + 1), row);
            const startCol = Math.min(Math.max(viewport.startCol, col - VISIBLE_COLS + 1), col);
            setViewport({ startRow, startCol });
            return { row, col };
        });
    };

    return (
        <div
            className="spreadsheet-grid"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            ref={gridRef}
        >
            {Array.from({ length: VISIBLE_ROWS }).map((_, rowIndex) => (
                <div key={rowIndex} className="spreadsheet-row">
                    {Array.from({ length: VISIBLE_COLS }).map((_, colIndex) => {
                        const actualRow = viewport.startRow + rowIndex;
                        const actualCol = viewport.startCol + colIndex;
                        return (
                            <div
                                key={colIndex}
                                className={`cell ${
                                    selectedCell.row === actualRow && selectedCell.col === actualCol
                                        ? 'selected'
                                        : ''
                                }`}
                            >
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Spreadsheet;