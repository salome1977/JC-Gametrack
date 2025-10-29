import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService } from '../services/api';

const TestForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // Datos COMPLETOS y CORRECTOS para probar
    const testData = {
      title: "The Legend of Zelda: Breath of the Wild",
      genre: "Aventura",
      platform: "Nintendo Switch",
      releaseDate: "2017-03-03",
      developer: "Nintendo EPD",
      publisher: "Nintendo",
      description: "Un juego de aventura en mundo abierto donde exploras el reino de Hyrule. Link despierta de un sueño de 100 años para derrotar a Calamity Ganon.",
      coverImageUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2r2f.jpg",
      averageRating: 5,
      totalReviews: 1500,
      hoursPlayed: 85,
      completed: true
    };

    console.log('🎯 === INICIANDO PRUEBA ===');
    console.log('📦 Datos a enviar:', JSON.stringify(testData, null, 2));
    console.log('🔗 URL destino: http://localhost:5000/api/games');

    try {
      // DEBUG: Verificar el servicio API
      console.log('🔍 Llamando a gameService.createGame...');
      
      const response = await gameService.createGame(testData);
      
      console.log('✅ === PRUEBA EXITOSA ===');
      console.log('📨 Respuesta del servidor:', response.data);
      console.log('🎮 Juego creado con ID:', response.data._id);
      
      alert('✅ ¡Juego creado exitosamente!\nID: ' + response.data._id);
      navigate('/');
    } catch (err) {
      console.error('❌ === PRUEBA FALLIDA ===');
      console.error('📋 Error completo:', err);
      console.error('🔍 Response data:', err.response?.data);
      console.error('🌐 Request config:', err.config);
      console.error('📮 Status code:', err.response?.status);
      console.error('🔗 Headers:', err.response?.headers);
      
      // Mostrar detalles específicos
      if (err.response?.data?.details) {
        console.error('📝 Errores de validación:', err.response.data.details);
      }
      
      alert('❌ Error al crear juego:\n' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>🔧 Formulario de Prueba - DEBUG</h1>
        <p>Este formulario envía datos fijos para probar el backend</p>
        
        <div style={{
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '10px', 
          marginBottom: '25px',
          border: '2px solid #e9ecef'
        }}>
          <h3 style={{color: '#495057', marginBottom: '15px'}}>📋 Datos que se enviarán:</h3>
          <pre style={{
            fontSize: '12px', 
            background: 'white', 
            padding: '15px',
            borderRadius: '5px',
            border: '1px solid #dee2e6',
            overflow: 'auto',
            maxHeight: '300px'
          }}>
{`{
  "title": "The Legend of Zelda: Breath of the Wild",
  "genre": "Aventura",
  "platform": "Nintendo Switch",
  "releaseDate": "2017-03-03",
  "developer": "Nintendo EPD",
  "publisher": "Nintendo",
  "description": "Un juego de aventura en mundo abierto donde exploras el reino de Hyrule. Link despierta de un sueño de 100 años para derrotar a Calamity Ganon.",
  "coverImageUrl": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2r2f.jpg",
  "averageRating": 5,
  "totalReviews": 1500,
  "hoursPlayed": 85,
  "completed": true
}`}
          </pre>
        </div>

        <div style={{
          background: loading ? '#fff3cd' : '#d1ecf1',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: `2px solid ${loading ? '#ffeaa7' : '#bee5eb'}`
        }}>
          <h4 style={{color: loading ? '#856404' : '#0c5460', margin: '0 0 10px 0'}}>
            {loading ? '🔄 Enviando datos...' : '📤 Listo para enviar'}
          </h4>
          <p style={{color: loading ? '#856404' : '#0c5460', margin: 0, fontSize: '14px'}}>
            {loading 
              ? 'Verifica la consola del backend y del navegador para ver los logs...' 
              : 'Haz clic en el botón para probar la comunicación con el backend'
            }
          </p>
        </div>
        
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="btn btn-primary"
            style={{
              padding: '15px 30px', 
              fontSize: '1.2rem',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Enviando...' : '🎮 Probar Creación de Juego'}
          </button>

          <button 
            onClick={() => navigate('/add-game')}
            className="btn btn-secondary"
            style={{
              padding: '15px 20px',
              backgroundColor: '#6c757d',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Volver al Formulario Normal
          </button>

          <button 
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{
              padding: '15px 20px',
              backgroundColor: '#28a745',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Ir a la Lista
          </button>
        </div>

        <div style={{
          marginTop: '25px',
          padding: '15px',
          background: '#e2e3e5',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          <strong>📝 Instrucciones de Debug:</strong>
          <ol style={{margin: '10px 0 0 0', paddingLeft: '20px'}}>
            <li>Abre la consola del navegador (F12 → Console)</li>
            <li>Haz clic en el botón "Probar Creación de Juego"</li>
            <li>Revisa los logs en el backend y frontend</li>
            <li>Comparte los mensajes de error si aparecen</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestForm;