// AuthStatus.tsx
import React from 'react';
import { useAuth } from './AuthContext';

const AuthStatus = () => {
  const { isLoggedIn, userName, loginUser, logoutUser } = useAuth();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{isLoggedIn ? '✅ Conectado' : '❌ Desconectado'}</h1>
      {isLoggedIn && userName && <h2>Usuario: {userName}</h2>}
      <button
        onClick={() => {
          if (isLoggedIn) {
            logoutUser();
          } else {
            loginUser('Jose Manzano');
          }
        }}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '20px',
          cursor: 'pointer',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: isLoggedIn ? 'red' : 'green',
          color: 'white',
        }}
      >
        {isLoggedIn ? 'Cerrar Sesión' : 'Iniciar Sesión'}
      </button>
    </div>
  );
};

export default AuthStatus;
