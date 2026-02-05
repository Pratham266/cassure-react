import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Login successful!');
      navigate('/simple');
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8faff',
      padding: '20px'
    }}>
      <Card 
        bordered={false}
        style={{
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
          borderRadius: '16px',
          padding: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px',
            marginBottom: '4px'
          }}>
            <img 
              src="/caassure-logo.png" 
              alt="Logo" 
              style={{ height: '40px', width: 'auto' }} 
            />
            <div style={{ 
              fontSize: '32px', 
              fontWeight: 800, 
              letterSpacing: '-0.03em' 
            }}>
              <span style={{ color: '#1e293b' }}>CA</span>
              <span style={{ color: '#5B4EF5' }}>assure</span>
            </div>
          </div>
          <Text type="secondary" style={{ fontSize: '14px', display: 'block' }}>
            Sign in to your accounting workspace
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label={<Text strong style={{ fontSize: '13px', color: '#475569' }}>Email Address</Text>}
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
            style={{ marginBottom: '16px' }}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="name@company.com" 
              style={{ borderRadius: '8px', height: '44px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong style={{ fontSize: '13px', color: '#475569' }}>Password</Text>}
            rules={[{ required: true, message: 'Please input your password!' }]}
            style={{ marginBottom: '24px' }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="••••••••"
              style={{ borderRadius: '8px', height: '44px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              style={{ 
                height: '52px', 
                fontSize: '16px', 
                fontWeight: 700, 
                borderRadius: '8px',
                background: '#5B4EF5',
                border: 'none',
                boxShadow: '0 4px 12px rgba(91, 78, 245, 0.25)'
              }}
            >
              Sign In
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#5B4EF5', fontWeight: 600 }}>
                Create account
              </Link>
            </Text>
            <div style={{ marginTop: '12px', opacity: 0.5, fontSize: '12px' }}>
              Created by <a href="https://quantumcusp.co" target="_blank" style={{ color: 'inherit', fontWeight: 600 }}>quantumcusp.co</a>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
