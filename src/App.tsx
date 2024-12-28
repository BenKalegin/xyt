import React from 'react';
import Spreadsheet from './components/Spreadsheet';
import DataWizards from './components/DataWizards';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <div className="spreadsheet">
        <Spreadsheet />
      </div>
      <div className="data-wizards">
        <DataWizards />
      </div>
    </div>
  );
};

export default App;