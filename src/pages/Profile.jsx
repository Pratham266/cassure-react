import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Space, Divider, Modal } from 'antd';
import { 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineCheck, 
  HiOutlineTrash, 
  HiOutlineExclamationCircle 
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;
const { confirm } = Modal;

const Profile = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber
      });
    }
  }, [user, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateProfile(values);
      message.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      message.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete your account?',
      icon: <HiOutlineExclamationCircle style={{ color: '#ff4d4f', fontSize: '22px' }} />,
      content: 'This action is permanent and cannot be undone. All your data will be permanently deleted.',
      okText: 'Yes, Delete Account',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await deleteAccount();
          message.success('Account deleted successfully');
        } catch (error) {
          message.error('Failed to delete account');
        }
      },
    });
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>User Profile</Title>
        <Text type="secondary">Manage your account information and preferences</Text>
      </div>

      <Card 
        bordered={false} 
        style={{ 
          borderRadius: '24px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
          background: '#ffffff',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              background: '#f5f3ff', 
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#5b4ef5',
              fontSize: '28px',
              fontWeight: 800,
              boxShadow: '0 10px 15px -3px rgba(91, 78, 245, 0.1)'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <Title level={4} style={{ margin: 0, fontWeight: 700 }}>{user?.name}</Title>
              <Text type="secondary">{user?.role?.toUpperCase()} ACCOUNT</Text>
            </div>
          </div>
          <Button 
            type={isEditing ? "default" : "primary"}
            onClick={() => setIsEditing(!isEditing)}
            style={{ 
              background: isEditing ? 'transparent' : '#5b4ef5',
              border: isEditing ? '1px solid #e2e8f0' : 'none',
              borderRadius: '12px',
              height: '40px',
              padding: '0 24px',
              fontWeight: 600
            }}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <Divider style={{ margin: '0 0 32px 0', borderColor: '#f1f5f9' }} />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={!isEditing}
          size="large"
          requiredMark={false}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0 32px' }}>
            <Form.Item
              name="name"
              label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Full Name</Text>}
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input 
                prefix={<HiOutlineUser style={{ color: '#94a3b8', fontSize: '18px' }} />} 
                style={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: isEditing ? 'white' : '#f8fafc' }}
              />
            </Form.Item>
 
            <Form.Item
              name="email"
              label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Email Address</Text>}
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<HiOutlineEnvelope style={{ color: '#94a3b8', fontSize: '18px' }} />} 
                style={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: isEditing ? 'white' : '#f8fafc' }}
              />
            </Form.Item>

            <Form.Item
              name="mobileNumber"
              label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Mobile Number</Text>}
              rules={[
                { required: true, message: 'Please input your mobile number!' },
                { pattern: /^[0-9]{10,12}$/, message: 'Please enter a valid mobile number!' }
              ]}
            >
              <Input 
                prefix={<HiOutlinePhone style={{ color: '#94a3b8', fontSize: '18px' }} />} 
                style={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: isEditing ? 'white' : '#f8fafc' }}
              />
            </Form.Item>
          </div>

          {isEditing && (
            <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit"                 icon={<HiOutlineCheck style={{ fontSize: '18px' }} />} 
                loading={loading}
                style={{ 
                  background: '#5b4ef5', 
                  borderRadius: '12px', 
                  height: '48px', 
                  fontSize: '15px', 
                  fontWeight: 600,
                  padding: '0 32px',
                  boxShadow: '0 4px 12px rgba(91, 78, 245, 0.25)'
                }}
              >
                Save Changes
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>

      <div style={{ marginTop: '48px', padding: '32px', background: '#fff1f0', borderRadius: '24px', border: '1px solid #ffa39e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={5} style={{ margin: 0, color: '#cf1322', fontWeight: 700 }}>Danger Zone</Title>
            <Text style={{ color: '#a8071a' }}>Permanently delete your account and all associated data</Text>
          </div>
          <Button 
            danger 
            type="primary"             icon={<HiOutlineTrash style={{ fontSize: '18px' }} />}
            onClick={showDeleteConfirm}
            style={{ borderRadius: '12px', height: '44px', fontWeight: 600 }}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
