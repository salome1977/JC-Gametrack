import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import GameList from './pages/GameList';
import GameForm from './pages/GameForm';
import Statistics from './pages/Statistics';
import GameDetail from './pages/GameDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<GameList />} />
            <Route path="/add-game" element={<GameForm />} />
            <Route path="/edit-game/:id" element={<GameForm />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;