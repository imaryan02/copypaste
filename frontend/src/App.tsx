import React from 'react';
import { Routes, Route} from 'react-router-dom';
import HomePage from './components/HomePage';
import PasteRoom from './components/PasteRoom';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:id" element={<PasteRoom />} />
      </Routes>
    </div>
  );
};

export default App;
