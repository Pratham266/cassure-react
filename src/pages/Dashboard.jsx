import React, { useState, useEffect } from 'react';
import SupportBanner from '../components/SupportBanner';

import { Row, Col, Card, Statistic, Typography, Table, Tag, message, Spin, Empty, Space } from 'antd';
import { 
  HiOutlineDocumentText, 
  HiOutlineCheckCircle, 
  HiOutlineExclamationCircle, 
  HiOutlineBuildingLibrary,
  HiOutlineClock,
  HiOutlineArrowUp
} from 'react-icons/hi2';
import { statementAPI } from '../utils/api';
import moment from 'moment';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [summary, setSummary] = useState({
    totalStatements: 0,
    inaccurateStatements: 0,
    accuracyRate: '0%'
  });


  useEffect(() => {
    fetchDashboardData(pagination.current);
  }, [pagination.current]);


  const fetchDashboardData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await statementAPI.getDashboardStats({ page, limit: pagination.pageSize });
      if (response.data.success) {
        setData(response.data.data);
        setSummary(response.data.summary);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current
    }));
  };


  const stats = [
    { 
      title: 'Total Statements', 
      value: summary.totalStatements, 
      icon: <HiOutlineDocumentText style={{ fontSize: '20px' }} />, 
      color: '#5B4EF5' 
    },
    { 
      title: 'Accuracy Rate', 
      value: summary.accuracyRate, 
      icon: <HiOutlineCheckCircle style={{ fontSize: '20px' }} />, 
      color: '#10b981' 
    },
    { 
      title: 'Failed/Inaccurate', 
      value: summary.inaccurateStatements, 
      icon: <HiOutlineExclamationCircle style={{ fontSize: '20px' }} />, 
      color: summary.inaccurateStatements > 0 ? '#ef4444' : '#64748b' 
    },
  ];

  const columns = [
    { 
      title: 'Upload Date', 
      dataIndex: 'uploadDate', 
      key: 'uploadDate',
      render: (date) => moment(date).format('DD MMM YYYY, HH:mm')
    },
    { 
      title: 'File Name', 
      dataIndex: 'fileName', 
      key: 'fileName',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Bank', 
      dataIndex: 'bankName', 
      key: 'bankName',
      render: (bank) => (
        <Space>
          <HiOutlineBuildingLibrary style={{ color: '#64748b', fontSize: '16px' }} />
          {bank}
        </Space>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'isAccurate', 
      key: 'isAccurate',
      render: (isAccurate) => (
        <Tag color={isAccurate ? 'success' : 'error'}>
          {isAccurate ? 'Accurate' : 'Inaccurate'}
        </Tag>
      )
    }
  ];

  return (

    <div style={{ padding: '40px 24px' }}>
      <SupportBanner />

      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Dashboard Overview</Title>
        <Text type="secondary">Real-time statistics of your bank statement processing activity.</Text>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {stats.map((stat, i) => (
          <Col xs={24} md={8} key={i}>
            <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <Statistic
                title={<Text strong style={{ color: '#64748b' }}>{stat.title}</Text>}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color, fontWeight: 800 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card 
        title={<Text strong style={{ fontSize: '18px' }}>Parsing Activity Log</Text>} 
        bordered={false} 
        style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
      >
        {loading || (data && data.length > 0) ? (
          <Table 
            dataSource={data} 
            columns={columns} 
            pagination={{
              ...pagination,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} items`
            }} 
            onChange={handleTableChange}
            rowKey="_id"
            loading={loading}
          />
        ) : (
          <Empty description="No parsing activity found yet. Start by uploading a statement!" />
        )}

      </Card>
    </div>
  );
};

export default Dashboard;
