import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameForm.css';

const GameForm = () => {
  const navigate = useNavigate();

  console.log('🎮 GameForm component is rendering!'); // Para debug

  return (
    <div className="container">
      <div className="form-container">
        <h1>Agregar Nuevo Juego - PRUEBA</h1>
        <p>¡Este es un componente de prueba!</p>
        
        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Formulario Básico</h3>
          <input 
            type="text" 
            placeholder="Título del juego" 
            style={{ padding: '10px', margin: '5px', width: '200px' }}
          />
          <br />
          <button 
            onClick={() => navigate('/')}
            style={{ padding: '10px 20px', margin: '5px' }}
          >
            Volver
          </button>
          <button 
            style={{ padding: '10px 20px', margin: '5px', background: '#4CAF50', color: 'white' }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameForm;