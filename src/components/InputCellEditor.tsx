import React from 'react';

interface InputCellEditorProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (moveToNextCell: boolean) => void;
}

const InputCellEditor: React.FC<InputCellEditorProps> = ({ value, onChange, onBlur }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onBlur(true);
        }
    };

    return (
        <input
            type="text"
            className="cell-editor"
            value={value}
            onChange={onChange}
            onBlur={() => onBlur(false)}
            onKeyDown={handleKeyDown}
            autoFocus
        />
    );
};

export default InputCellEditor;