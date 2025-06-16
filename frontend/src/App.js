import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QAForm from './QAForm';
import Login from './Login';
import CreateQADoc from './CreateQADoc';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/qaform" element={<QAForm />} />
        <Route path="/createqadoc" element={<CreateQADoc />} />
      </Routes>
    </Router>
  );
}

export default App;
