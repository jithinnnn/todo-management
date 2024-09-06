// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Homepage from './Homepage';
import ProjectDetail from './ProjectDetail';
import Register from './Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Routes> 
    </Router>
  );
}

export default App;
