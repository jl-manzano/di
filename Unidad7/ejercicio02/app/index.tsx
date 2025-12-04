// App.tsx
import React from 'react';
import { AuthProvider } from './AuthContext';
import AuthStatus from './AuthStatus';

const App = () => {
  return (
    <AuthProvider>
      <div>
        <AuthStatus />
      </div>
    </AuthProvider>
  );
};

export default App;
