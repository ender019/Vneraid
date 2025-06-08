import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/home';
import SessionSettings from './pages/sessionSettings';
import Auth from './auth/auth';
import Settings from './pages/settings';

import Header from './components/heaeder';


import './static/main.css';

const App = () => {

  
  return (
    <Router>
        <Header/>
        <div className="main">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/session/:id" element={<SessionSettings />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
    </Router>
  );
};

export default App;