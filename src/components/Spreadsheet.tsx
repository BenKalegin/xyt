import React, { useEffect, useRef, useState } from 'react';
import './Spreadsheet.css';

const VISIBLE_ROWS = 20;
const VISIBLE_COLS = 10;
const MAX_ROWS = 64536;
const MAX_COLS = 16384;

const Spreadsheet: React.FC = () => {
    const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
    const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
    const [cellData, setCellData] = useState<Record<string, string>>({});
    const [viewport, setViewport] = useState({ startRow: 0, startCol: 0 });
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.focus();
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (editingCell) return;

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
                case 'Enter':
                    setEditingCell(prev);
                    break;
            }
            const startRow = Math.min(Math.max(viewport.startRow, row - VISIBLE_ROWS + 1), row);
            const startCol = Math.min(Math.max(viewport.startCol, col - VISIBLE_COLS + 1), col);
            setViewport({ startRow, startCol });
            return { row, col };
        });
    };

    const handleBlur = () => {
        setEditingCell(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = `${editingCell?.row},${editingCell?.col}`;
        setCellData((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const handleCellClick = (row: number, col: number) => {
        setSelectedCell({ row, col });
    };

    const getColumnHeader = (index: number) => {
        let column = "";
        while (index >= 0) {
            column = String.fromCharCode((index % 26) + 65) + column;
            index = Math.floor(index / 26) - 1;
        }
        return column;
    };

    const getCellContent = (row: number, col: number) => {
        const key = `${row},${col}`;
        return cellData[key] || "";
    };

    return (
        <div
            className="spreadsheet-container"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            ref={gridRef}
        >
            <div className="spreadsheet-header">
                <div className="row-header-empty" />
                {Array.from({ length: VISIBLE_COLS }).map((_, colIndex) => (
                    <div key={colIndex} className="column-header">
                        {getColumnHeader(viewport.startCol + colIndex)}
                    </div>
                ))}
            </div>
            <div className="spreadsheet-body">
                {Array.from({ length: VISIBLE_ROWS }).map((_, rowIndex) => (
                    <div key={rowIndex} className="spreadsheet-row">
                        <div className="row-header">{viewport.startRow + rowIndex + 1}</div>
                        {Array.from({ length: VISIBLE_COLS }).map((_, colIndex) => {
                            const actualRow = viewport.startRow + rowIndex;
                            const actualCol = viewport.startCol + colIndex;
                            const isEditing = editingCell?.row === actualRow && editingCell?.col === actualCol;
                            const isSelected = selectedCell.row === actualRow && selectedCell.col === actualCol;
                            return (
                                <div
                                    key={colIndex}
                                    className={`cell ${ isSelected ? 'selected' : '' }`}
                                    onClick={() => handleCellClick(actualRow, actualCol)}
                                    onDoubleClick={() => setEditingCell({ row: actualRow, col: actualCol })}
                                >
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="cell-editor"
                                            value={getCellContent(actualRow, actualCol)}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            autoFocus
                                        />
                                    ) : (
                                        getCellContent(actualRow, actualCol)
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Spreadsheet;
