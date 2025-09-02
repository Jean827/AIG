import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Button, Typography, message, Select } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, SettingOutlined, MenuFoldOutlined, MenuUnfoldOutlined, DatabaseOutlined, ShoppingCartOutlined, MailOutlined, LockOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getTenants } from '../../api/tenant';
import './SiderLayout.css';

const { Header, Sider } = Layout;
const { Title } = Typography;

const SiderLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [tenants, setTenants] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading, refreshUser } = useAuth();

  // 处理租户切换
  const handleTenantChange = (tenantId) => {
    if (!tenantId) {
      return;
    }
    
    const selectedTenant = tenants.find(t => t.id === tenantId);
    if (selectedTenant) {
      // 更新localStorage中的用户信息
      const updatedUser = {
        ...user,
        currentTenantId: selectedTenant.id,
        currentTenantName: selectedTenant.name,
        currentTenantCode: selectedTenant.code
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // 刷新用户状态
      refreshUser();
      
      // 显示成功消息
      message.success(`已切换到租户：${selectedTenant.name}`);
      
      // 刷新页面以应用租户变更
      navigate(0);
    }
  };
  
  // 加载菜单数据和租户列表
  useEffect(() => {
    const loadData = async () => {
      // 加载菜单数据 - 优化版本
      const loadedMenuItems = [
        {
          key: 'dashboard',
          icon: <HomeOutlined />,
          label: <Link to="/">仪表盘</Link>,
        },
        {
          key: 'tenant',
          icon: <DatabaseOutlined />,
          label: '租户管理',
          children: [
            {
              key: 'tenant-list',
              label: <Link to="/tenants">租户列表</Link>,
            },
            {
              key: 'tenant-create',
              label: <Link to="/tenants/create">创建租户</Link>,
            },
          ],
        },
        {
          key: 'product',
          icon: <FileTextOutlined />,
          label: <Link to="/products">产品管理</Link>,
        },
        {
          key: 'order',
          icon: <ShoppingCartOutlined />,
          label: '订单管理',
          children: [
            {
              key: 'order-list',
              label: <Link to="/orders">订单列表</Link>,
            },
            {
              key: 'order-create',
              label: <Link to="/orders/create">创建订单</Link>,
            },
          ],        },
        {
          key: 'user',
          icon: <UserOutlined />,
          label: <Link to="/users">用户管理</Link>,
        },
        {
          key: 'system',
          icon: <SettingOutlined />,
          label: '系统设置',
          children: [
            {
              key: 'email-config',
              icon: <MailOutlined />,
              label: <Link to="/email-config">邮件配置</Link>,
            },
            {
              key: 'permission-recommendations',
              icon: <LockOutlined />,
              label: <Link to="/permission-recommendations">权限推荐</Link>,
            },
          ],
        },
        // 移除未分类菜单，将系统设置整合到一个分组中
      ];

      setMenuItems(loadedMenuItems);
      
      // 加载租户列表（仅超级管理员需要）
      if (user && user.tenantId === null) {
        try {
          const response = await getTenants();
          setTenants(response.data || []);
        } catch (error) {
          console.error('Failed to load tenants:', error);
        }
      }
    };

    loadData();
  }, [user]);

  // 用户菜单
  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: (
        <Button type="text" danger onClick={logout}>
          退出登录
        </Button>
      ),
    },
  ];

  // 如果用户未登录，不渲染任何内容
  if (!user && !loading) {
    return null;
  }

  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className={`sider ${collapsed ? 'sider-collapsed' : ''}`}
        width={250}
      >
        <div className="logo">
          <Title level={4} style={{ color: '#fff', margin: '16px 0', textAlign: 'center' }}>
            {collapsed ? '系统' : '管理系统'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname.replace(/\//g, '-').substring(1) || 'dashboard']}
          items={menuItems}
          className="menu"
        />
      </Sider>
      <Header className="header">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="trigger"
        />
        <div className="header-right">
          {user && (
            <>
              {/* 显示当前租户信息 */}
              {(user.currentTenantId || user.tenantId) && (
                <Space style={{ marginRight: '16px' }}>
                  <HomeOutlined style={{ color: '#1890ff' }} />
                  <span>
                    {user.currentTenantName || user.tenantName}
                  </span>
                </Space>
              )}
              
              {/* 超级管理员租户切换下拉框 */}
              {user.tenantId === null && tenants.length > 0 && (
                <Select
                  placeholder="选择租户"
                  style={{ width: 150, marginRight: '16px' }}
                  onChange={handleTenantChange}
                  value={user.currentTenantId || undefined}
                  options={tenants.map(tenant => ({
                    label: tenant.name,
                    value: tenant.id
                  }))}
                />
              )}
              
              <Dropdown menu={{ items: userMenuItems }}>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <span>{user.username}</span>
                </Space>
              </Dropdown>
            </>
          )}
        </div>
      </Header>
    </>
  );
};

export default SiderLayout;