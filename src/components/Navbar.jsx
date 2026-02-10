import React, { useState } from 'react';
import { Layout, Dropdown, Avatar, Space, Modal, Form, Input, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiOutlineDocumentText, 
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi2';
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

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const menuItems = [
    {
      key: '/simple',
      icon: <HiOutlineDocumentText />,
      label: 'Home'
    },
    {
      key: '/transactions',
      icon: <FileTextOutlined />, 
      label: 'Billing'
    }
  ];

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
          zIndex: 1000,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}
      >
        {/* Left Side: Logo & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          {/* Logo */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer' 
          }} onClick={() => navigate('/')}>
             <img 
               src="/caassure-logo.png" 
               alt="Logo" 
               style={{ height: '24px', width: 'auto' }} 
             />
             <div style={{ 
               fontSize: '20px', 
               fontWeight: 800, 
               letterSpacing: '-0.02em',
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

        {/* Right Side: User Profile & Help icon & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            onClick={() => setIsHelpVisible(true)}
          >
            <HiOutlineQuestionMarkCircle style={{ fontSize: '20px', color: '#64748b' }} />
          </div>

          <div 
            onClick={() => navigate('/profile')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '4px 12px 4px 6px',
              background: '#f8fafc',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              height: '40px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.borderColor = '#5B4EF5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
             <Avatar 
               size={30} 
               style={{ 
                 backgroundColor: '#5B4EF5',
                 fontSize: '12px',
                 fontWeight: 700,
                 flexShrink: 0
               }}
             >
               {getInitials(user?.name)}
             </Avatar>
             <span style={{ 
               color: '#475569', 
               fontWeight: 600,
               fontSize: '13px',
               maxWidth: '100px',
               overflow: 'hidden',
               textOverflow: 'ellipsis',
               whiteSpace: 'nowrap'
             }}>
               {user?.name}
             </span>
          </div>

          <Button 
            type="text" 
            danger 
            icon={<HiOutlineArrowRightOnRectangle />}
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{ 
              fontWeight: 600,
              fontSize: '14px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Logout
          </Button>
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
