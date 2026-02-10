import React from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Tag, 
  Statistic, 
  Progress,
  Alert
} from 'antd';
import { 
  HiOutlineInformationCircle,
  HiOutlineArrowPath,
  HiOutlineCloud,
  HiOutlineChatBubbleLeftRight
} from 'react-icons/hi2';
import { HiCheckCircle } from 'react-icons/hi';

const { Title, Text, Paragraph } = Typography;

const Billing = () => {
  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="fade-in-up" style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#1A1A1A', marginBottom: '8px' }}>
          Billing & Subscription
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Manage your account plan, usage limits, and subscription settings.
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Current Plan Details */}
        <Col xs={24} lg={16}>
          <Card 
            bordered={false}
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              background: '#ffffff',
              height: '100%'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <Tag color="blue" style={{ marginBottom: '12px', borderRadius: '4px', padding: '2px 8px' }}>CURRENT PLAN</Tag>
                <Title level={3} style={{ margin: 0, color: '#5B4EF5' }}>Enjoy Plan</Title>
              </div>
              <Tag icon={<HiCheckCircle style={{ fontSize: '14px' }} />} color="success" style={{ borderRadius: '20px', padding: '4px 12px' }}>Active</Tag>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Page Scanning Usage</Text>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: '#1A1A1A' }}>Unlimited</span>
                <Text type="secondary">/ billing cycle</Text>
              </div>
              <Progress 
                percent={100} 
                showInfo={false} 
                strokeColor="#5B4EF5" 
                trailColor="#f0f2f5"
                status="active"
              />
            </div>

            <Row gutter={24}>
              <Col span={8}>
                <Statistic title="Total Scans" value="∞" valueStyle={{ color: '#5B4EF5' }} />
              </Col>
              <Col span={8}>
                <Statistic title="Cloud Storage" value="Unlimited" valueStyle={{ fontSize: '16px', fontWeight: 600 }} />
              </Col>
              <Col span={8}>
                <Statistic title="Next Renewal" value="N/A" valueStyle={{ fontSize: '16px', fontWeight: 600 }} />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Plan Features */}
        <Col xs={24} lg={8}>
          <Card 
            title="Plan Benefits"
            bordered={false}
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              height: '100%'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <HiOutlineArrowPath style={{ color: '#5B4EF5', fontSize: '18px', marginTop: '4px' }} />
                <div>
                  <Text strong style={{ display: 'block' }}>Priority Processing</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Statements are processed in the high-speed queue.</Text>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <HiOutlineCloud style={{ color: '#5B4EF5', fontSize: '18px', marginTop: '4px' }} />
                <div>
                  <Text strong style={{ display: 'block' }}>Multi-bank Support</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Access to all supported bank statement templates.</Text>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <HiOutlineChatBubbleLeftRight style={{ color: '#5B4EF5', fontSize: '18px', marginTop: '4px' }} />
                <div>
                  <Text strong style={{ display: 'block' }}>Early Access</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Instant access to all beta features and toolsets.</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Testing Phase Notice - Professional Corporate Style */}
        <Col span={24}>
          <Alert
            message={
              <Text strong style={{ fontSize: '16px', color: '#003a8c' }}>
                Foundational Growth & Testing Phase Notification
              </Text>
            }
            description={
              <div style={{ marginTop: '8px' }}>
                <Paragraph style={{ color: '#002766', fontSize: '14px', lineHeight: '1.6' }}>
                  The caassure platform is currently in a strategic **Foundational Testing Phase**. During this period, we are prioritizing system stability, parsing accuracy, and feature refinement to ensure the highest standard of service for our users.
                </Paragraph>
                <Paragraph style={{ color: '#002766', fontSize: '14px', lineHeight: '1.6' }}>
                  As an esteemed early adopter, your account is provisioned with our comprehensive **"Enjoy Plan"**, granting you unrestricted access to our unlimited page scanning capabilities at no additional commitment. Your interaction with the platform is essential to our iterative development process.
                </Paragraph>
                <Paragraph style={{ color: '#002766', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  Should you encounter any operational discrepancies or require further technical clarification, we invite you to communicate with our engineering team via the **Help & Support Form**. Your professional feedback is a cornerstone of our continuous improvement.
                </Paragraph>
              </div>
            }
            type="info"
            showIcon
            icon={<HiOutlineInformationCircle style={{ fontSize: '24px' }} />}
            style={{ 
              borderRadius: '8px',
              padding: '24px',
              backgroundColor: '#e6f7ff',
              border: '1px solid #91d5ff'
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Billing;

