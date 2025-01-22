import React, { useEffect, useRef, useState } from 'react';
import InputCellEditor from "./InputCellEditor";
import './Spreadsheet.css';

const VISIBLE_ROWS = 20;
const VISIBLE_COLS = 10;
const MAX_ROWS = 64536;
const MAX_COLS = 16384;

const Spreadsheet: React.FC = () => {
    const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
    const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
    const [cellData, setCellData] = useState<Record<string, CellData>>({});
    const [viewport, setViewport] = useState({ startRow: 0, startCol: 0 });
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.focus();
        }
    }, []);

    function autoAlignment(content: string) {
        // if looks like number, align right
        if (/^-?\d*\.?\d*$/.test(content)) {
            return 'right';
        }
        // if looks like date, align center
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(content)) {
            return 'center';
        }

        // if looks like time, align center
        if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(content)) {
            return 'center';
        }

        return 'left';
    }

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

                case 'Delete':
                case 'Backspace':
                    setCellData((prev) => {
                        const newData = { ...prev };
                        delete newData[`${row},${col}`];
                        return newData;
                    });
                    break;

                case 'Enter':
                case 'a': case 'b': case 'c': case 'd': case 'e': case 'f': case 'g': case 'h': case 'i': case 'j': case 'k': case 'l': case 'm': case 'n': case 'o': case 'p': case 'q': case 'r': case 's': case 't': case 'u': case 'v': case 'w': case 'x': case 'y': case 'z':
                case 'A': case 'B': case 'C': case 'D': case 'E': case 'F': case 'G': case 'H': case 'I': case 'J': case 'K': case 'L': case 'M': case 'N': case 'O': case 'P': case 'Q': case 'R': case 'S': case 'T': case 'U': case 'V': case 'W': case 'X': case 'Y': case 'Z':
                case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
                    setEditingCell(prev);
                    if (e.key !== 'Enter') {
                        let newCell = { ...cellData[`${row},${col}`] };
                        newCell.content = e.key;
                        newCell.alignment = newCell.alignment || autoAlignment(newCell.content)

                        setCellData((prev) => ({ ...prev, [`${row},${col}`]: newCell }));
                    }
                    break;
            }
            const startRow = Math.min(Math.max(viewport.startRow, row - VISIBLE_ROWS + 1), row);
            const startCol = Math.min(Math.max(viewport.startCol, col - VISIBLE_COLS + 1), col);
            setViewport({ startRow, startCol });
            return { row, col };
        });
    };

    const handleBlur = (moveToNextCell: boolean) => {
        setEditingCell(null);
        if (moveToNextCell) {
            setSelectedCell((prev) => {
                let { row, col } = prev;
                if (col < MAX_COLS - 1) {
                    col++;
                } else if (row < MAX_ROWS - 1) {
                    row++;
                    col = 0;
                }
                return { row, col };
            });
        }
        if (gridRef.current) {
            gridRef.current.focus();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = `${editingCell?.row},${editingCell?.col}`;
        const cell = { ...cellData[key] };
        cell.content = e.target.value;
        cell.alignment = autoAlignment(cell.content);
        setCellData((prev) => ({ ...prev, [key]: cell }));
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
                            const cellContent = getCellContent(actualRow, actualCol);
                            return (
                                <div style={{ justifyContent: cellContent.alignment || 'left' }}
                                    key={colIndex}
                                    className={`cell ${ isSelected ? 'selected' : '' }`}
                                    onClick={() => handleCellClick(actualRow, actualCol)}
                                    onDoubleClick={() => setEditingCell({ row: actualRow, col: actualCol })}
                                >
                                    {isEditing ? (
                                        <InputCellEditor
                                            value={cellContent.content}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                        />
                                    ) : (
                                        cellContent.content
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
