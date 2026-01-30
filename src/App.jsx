import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout, Spin } from 'antd';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Billing from './pages/Billing';
import SimpleUpload from './pages/SimpleUpload';

// Components
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {user && <Navbar />}
      <Layout.Content>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/simple" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/simple" /> : <Register />} />
          <Route path="/simple" element={<PrivateRoute><SimpleUpload /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Billing /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/simple" />} />
        </Routes>
      </Layout.Content>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
