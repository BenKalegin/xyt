import React from 'react';

interface InputCellEditorProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
}

const InputCellEditor: React.FC<InputCellEditorProps> = ({ value, onChange, onBlur }) => {
    return (
        <input
            type="text"
            className="cell-editor"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            autoFocus
        />
    );
};

export default InputCellEditor;