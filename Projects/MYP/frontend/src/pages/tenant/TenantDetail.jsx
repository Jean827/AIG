import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, message, Descriptions, Divider, Table } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { getTenantById, getTenantUsers } from '../../api/tenant';

const TenantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 加载租户详情
  useEffect(() => {
    fetchTenantDetail();
  }, [id]);

  const fetchTenantDetail = async () => {
    setLoading(true);
    try {
      // 获取租户详情
      const tenantResponse = await getTenantById(id);
      setTenant(tenantResponse.data);

      // 获取租户用户
      const usersResponse = await getTenantUsers(id);
      setUsers(usersResponse.data || []);
    } catch (error) {
      message.error('获取租户详情失败');
      console.error('Failed to fetch tenant detail:', error);
    }
    setLoading(false);
  };

  // 用户表格列配置
  const userColumns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 1 ? 'green' : 'red' }}>
          {status === 1 ? '启用' : '禁用'}
        </span>
      )
    },
  ];

  return (
    <div className="tenant-detail-container">
      <div className="header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/tenants')}
          style={{ marginRight: 16 }}
        >
          返回
        </Button>
        <h2>租户详情</h2>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/tenants/${id}/edit`)}
        >
          编辑租户
        </Button>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : tenant ? (
        <div className="content">
          <Card title="基本信息" style={{ marginBottom: 24 }}>
            <Descriptions column={2} title="租户信息" bordered>
              <Descriptions.Item label="租户名称">{tenant.name}</Descriptions.Item>
              <Descriptions.Item label="租户编码">{tenant.code}</Descriptions.Item>
              <Descriptions.Item label="联系人">{tenant.contactPerson}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{tenant.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{tenant.email}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <span style={{ color: tenant.status === 1 ? 'green' : 'red' }}>
                  {tenant.status === 1 ? '启用' : '禁用'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{tenant.createdAt}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{tenant.updatedAt}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Divider orientation="left">
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <UserOutlined style={{ marginRight: 8 }} />
              租户用户
            </span>
          </Divider>

          <Card>
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>
      ) : (
        <div className="empty">未找到租户信息</div>
      )}
    </div>
  );
};

export default TenantDetail;