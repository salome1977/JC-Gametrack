import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import GameList from './pages/GameList';
import TestForm from './pages/TestForm'; // validar el formulario de prueba
import GameForm from './pages/GameForm';
import Statistics from './pages/Statistics';
import GameDetail from './pages/GameDetail';
import PersonalStars from './pages/PersonalStats';
import ReviewForm from './pages/ReviewForm';
import ReviewList from './pages/ReviewList';

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
            <Route path="/gameform" element={<GameForm />} />
            <Route path="/testform" element={<TestForm />} />
            <Route path="/personal-stars" element={<PersonalStars />} />
            <Route path="/game/:id/reviews" element={<ReviewList />} />
            <Route path="/game/:id/add-review" element={<ReviewForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;