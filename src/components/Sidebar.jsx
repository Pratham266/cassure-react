import React from 'react';
import { Layout, Menu, Button, Avatar, Typography, Divider } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileTextOutlined, 
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  CreditCardOutlined,
  RocketOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Sider } = Layout;
const { Title, Text } = Typography;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

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
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/simple',
      icon: <FileTextOutlined />,
      label: 'Converter',
    },
    {
      key: '/billing',
      icon: <CreditCardOutlined />,
      label: 'Subscription',
    },
    {
      key: '/support',
      icon: <RocketOutlined />,
      label: 'Feature Request',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
  ];

  return (
    <Sider
      width={260}
      collapsedWidth={80}
      theme="light"
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        borderRight: '1px solid #f1f5f9',
        zIndex: 1001,
        transition: 'all 0.2s'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 0' }}>
        {/* Logo & Toggle */}
        <div 
          style={{ 
            padding: collapsed ? '0 8px' : '0 24px', 
            marginBottom: '32px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'space-between',
            flexDirection: collapsed ? 'column-reverse' : 'row',
            gap: '16px'
          }}
        >
          {!collapsed ? (
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <img src="/caassure-logo.png" alt="Logo" style={{ height: '32px' }} />
              <div style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em' }}>
                <span style={{ color: '#1e293b' }}>CA</span>
                <span style={{ color: '#5B4EF5' }}>assure</span>
              </div>
            </div>
          ) : (
            <img 
              src="/caassure-logo.png" 
              alt="Logo" 
              style={{ height: '32px', cursor: 'pointer', marginBottom: '8px' }} 
              onClick={() => navigate('/')}
            />
          )}
          
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              background: '#f8fafc',
              borderRadius: '8px'
            }}
          />
        </div>

        {/* Menu */}
        <div style={{ flex: 1 }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none' }}
            className="sidebar-menu"
          />
        </div>

        {/* Bottom Section */}
        <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Divider style={{ margin: '16px 0', borderColor: '#f1f5f9', width: '100%' }} />

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '12px', 
            padding: '8px',
            background: collapsed ? 'transparent' : '#f8fafc',
            borderRadius: '12px',
            marginBottom: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%',
            overflow: 'hidden'
          }}
          onClick={() => navigate('/profile')}
          className="user-pill"
          title={user?.name}
          >
            <Avatar size={36} style={{ backgroundColor: '#5B4EF5', fontWeight: 700, flexShrink: 0 }}>
              {getInitials(user?.name)}
            </Avatar>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </div>
              </div>
            )}
          </div>

          <Button 
            type="text" 
            danger 
            block 
            icon={<LogoutOutlined style={{ fontSize: '18px' }} />}
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: collapsed ? 'center' : 'flex-start',
              height: '44px',
              fontWeight: 600,
              borderRadius: '8px',
              padding: collapsed ? '0' : '0 12px'
            }}
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>

      <style>
        {`
          .sidebar-menu {
            border-inline-end: none !important;
          }
          .sidebar-menu .ant-menu-item {
            height: 48px !important;
            margin: 8px 12px !important;
            border-radius: 8px !important;
            display: flex !important;
            align-items: center !important;
          }
          .sidebar-menu .ant-menu-item .ant-menu-item-icon,
          .sidebar-menu .ant-menu-item .anticon {
            font-size: 18px !important;
            color: #64748b !important;
            transition: color 0.2s;
          }
          .sidebar-menu .ant-menu-item-selected {
            background-color: #f5f3ff !important;
            color: #5B4EF5 !important;
          }
          .sidebar-menu .ant-menu-item-selected .anticon,
          .sidebar-menu .ant-menu-item-selected .ant-menu-item-icon {
            color: #5B4EF5 !important;
          }
          .user-pill:hover {
            background: #f1f5f9 !important;
          }
        `}
      </style>
    </Sider>
  );
};

export default Sidebar;
