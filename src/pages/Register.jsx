import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values);
      message.success('Registration successful!');
      navigate('/simple');
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed');
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
        <div style={{ textAlign: 'center', marginBottom: '24px', marginTop: '0px' }}>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 800, 
            letterSpacing: '-0.03em',
            marginBottom: '0px' 
          }}>
            <span style={{ color: '#1e293b' }}>CA</span>
            <span style={{ color: '#5B4EF5' }}>assure</span>
          </div>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Start managing your bank statements with ease
          </Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={<Text strong style={{ fontSize: '13px', color: '#475569' }}>Full Name</Text>}
            rules={[{ required: true, message: 'Please input your name!' }]}
            style={{ marginBottom: '12px' }}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="John Doe" 
              style={{ borderRadius: '8px', height: '42px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<Text strong style={{ fontSize: '13px', color: '#475569' }}>Email Address</Text>}
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
            style={{ marginBottom: '12px' }}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="name@company.com" 
              style={{ borderRadius: '8px', height: '42px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong style={{ fontSize: '13px', color: '#475569' }}>Password</Text>}
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
            style={{ marginBottom: '12px' }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="••••••••"
              style={{ borderRadius: '8px', height: '42px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<Text strong style={{ fontSize: '13px', color: '#475569' }}>Confirm Password</Text>}
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                }
              })
            ]}
            style={{ marginBottom: '24px' }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="••••••••"
              style={{ borderRadius: '8px', height: '42px' }}
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
              Get Started
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#5B4EF5', fontWeight: 600 }}>
                Sign in
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
