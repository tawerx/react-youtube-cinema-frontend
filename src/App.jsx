import React from 'react';
import { Route, Routes } from 'react-router-dom';

import CheckRoom from './routes/CheckRoom';
import Main from './routes/Main';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/:id" element={<CheckRoom />} />
    </Routes>
  );
};
export default App;
