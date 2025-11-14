import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
         <img 
            src="/images/LogoGT.png" 
            alt="GameTracker Logo" 
            className="logo-image"
            width="128" height="140"
          />
           GAME TRACKER
          {/*🎮 GameTracker asi era la forma sencilla, ahora con mi logo*/}
        </Link>
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Mi Biblioteca
          </Link>
          <Link 
            to="/add-game" 
            className={`nav-link ${location.pathname === '/add-game' ? 'active' : ''}`}
          >
            Agregar Juego
          </Link>
          <Link 
            to="/statistics" 
            className={`nav-link ${location.pathname === '/statistics' ? 'active' : ''}`}
          >
            Estadísticas
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;