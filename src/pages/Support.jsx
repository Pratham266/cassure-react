import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select, message, Alert, Space } from 'antd';
import { 
  HiOutlineQuestionMarkCircle, 
  HiOutlinePaperAirplane, 
  HiOutlineRocketLaunch, 
  HiOutlineBugAnt
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { helpAPI } from '../utils/api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Support = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await helpAPI.submit(values);
      if (response.data.success) {
        message.success(response.data.message);
        form.resetFields(['subject', 'message']);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
          Support & Feedback
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Need help or have a feature in mind? We're here to listen and improve CAssure for you.
        </Text>
      </div>

      <Alert
        message="Development Phase"
        description="We are currently in the active development phase. If you want any new feature or template to be added, please send us a request below!"
        type="info"
        showIcon
        icon={<HiOutlineRocketLaunch style={{ fontSize: '18px', color: '#5b4ef5' }} />}
        style={{ marginBottom: '32px', borderRadius: '12px', background: '#f5f3ff', border: '1px solid #ddd6fe' }}
      />

      <Card 
        bordered={false} 
        style={{ 
          borderRadius: '24px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          requiredMark={false}
          initialValues={{
            name: user?.name,
            email: user?.email,
            subject: 'General Support'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
            <Form.Item
              name="name"
              label={<Text strong style={{ color: '#475569' }}>Your Name</Text>}
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input disabled style={{ borderRadius: '8px' }} />
            </Form.Item>

            <Form.Item
              name="email"
              label={<Text strong style={{ color: '#475569' }}>Email Address</Text>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input disabled style={{ borderRadius: '8px' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="subject"
            label={<Text strong style={{ color: '#475569' }}>Request Type / Subject</Text>}
            rules={[{ required: true, message: 'Please select a subject' }]}
          >
            <Select style={{ borderRadius: '8px' }}>
              <Option value="General Support">
                <Space><HiOutlineQuestionMarkCircle style={{ fontSize: '16px' }} /> General Support</Space>
              </Option>
              <Option value="Feature Request">
                <Space><HiOutlineRocketLaunch style={{ fontSize: '16px' }} /> Feature Request</Space>
              </Option>
              <Option value="Bug Report">
                <Space><HiOutlineBugAnt style={{ fontSize: '16px' }} /> Bug Report</Space>
              </Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="message"
            label={<Text strong style={{ color: '#475569' }}>Your Message / Feature Description</Text>}
            rules={[{ required: true, message: 'Please enter your message' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Tell us what's on your mind... If it's a feature request, please describe how it would help your workflow." 
              style={{ borderRadius: '12px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<HiOutlinePaperAirplane style={{ fontSize: '18px' }} />} 
              loading={loading}
              block
              style={{ 
                background: '#5b4ef5', 
                borderRadius: '12px', 
                height: '54px', 
                fontSize: '16px', 
                fontWeight: 700,
                boxShadow: '0 10px 15px -3px rgba(91, 78, 245, 0.2)'
              }}
            >
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Support;
