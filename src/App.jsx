import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout, Spin } from 'antd';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Billing from './pages/Billing';
import SimpleUpload from './pages/SimpleUpload';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Support from './pages/Support';

// Components
import Sidebar from './components/Sidebar';

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
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {user && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      <Layout style={{ 
        marginLeft: user ? (collapsed ? 80 : 260) : 0, 
        transition: 'all 0.2s' 
      }}>
        <Layout.Content style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/simple" element={<PrivateRoute><SimpleUpload /></PrivateRoute>} />
            <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
            <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Layout.Content>
      </Layout>
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
