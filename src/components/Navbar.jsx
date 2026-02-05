import React, { useState } from 'react';
import { Layout, Dropdown, Avatar, Space, Modal, Form, Input, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileTextOutlined, 
  TransactionOutlined,
  UserOutlined,
  LogoutOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { helpAPI } from '../utils/api';

const { TextArea } = Input;
const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleHelpSubmit = async (values) => {
    setSubmitting(true);
    try {
      const response = await helpAPI.submit(values);
      if (response.data.success) {
        message.success(response.data.message);
        setIsHelpVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error('Help submission error:', error);
      message.error(error.response?.data?.message || 'Failed to submit help request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  const menuItems = [
    {
      key: '/simple',
      icon: <FileTextOutlined />,
      label: 'Home'
    },
    {
      key: '/transactions',
      icon: <FileTextOutlined />, 
      label: 'Billing'
    }
  ];

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile'
      },
      {
        type: 'divider'
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        danger: true
      }
    ],
    onClick: handleUserMenuClick
  };

  return (
    <>
      <Header 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: '#ffffff',
          height: '64px',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        {/* Left Side: Logo & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          {/* Logo */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer' 
          }} onClick={() => navigate('/')}>
             <div style={{ 
               fontSize: '24px', 
               fontWeight: 800, 
               letterSpacing: '-0.03em',
               fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial'
             }}>
               <span style={{ color: '#1e293b' }}>CA</span>
               <span style={{ color: '#5B4EF5' }}>assure</span>
             </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {menuItems.map(item => {
              const isActive = location.pathname === item.key;
              return (
                <div
                  key={item.key}
                  onClick={() => handleMenuClick(item.key)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: User Profile & Help icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={() => setIsHelpVisible(true)}
          >
            <QuestionCircleOutlined style={{ fontSize: '20px', color: '#64748b' }} />
          </div>

          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer', gap: '12px' }}>
               <Avatar 
                 size="default" 
                 icon={<UserOutlined />}
                 style={{ backgroundColor: '#5B4EF5' }}
               />
               <span style={{ 
                 color: '#1A1A1A', 
                 fontWeight: 500,
                 fontSize: '14px',
                 textTransform: 'uppercase'
               }}>
                 {user?.name}
               </span>
            </Space>
          </Dropdown>
        </div>
      </Header>

      <Modal
        title="Help & Support"
        open={isHelpVisible}
        onCancel={() => setIsHelpVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleHelpSubmit}
          initialValues={{
            name: user?.name || '',
            email: user?.email || ''
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter your message' }]}
          >
            <TextArea 
              placeholder="How can we help you?" 
              rows={4} 
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsHelpVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Navbar;
