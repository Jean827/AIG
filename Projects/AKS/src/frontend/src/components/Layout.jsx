import React, { useState } from 'react';
import { Layout, Avatar, Dropdown, message, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';
import SideMenu from './menu/SideMenu';
import './Layout.css';

const { Header, Sider, Content } = Layout;

const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState(false);

  // 处理侧边栏展开/收起
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // 处理退出登录
  const handleLogout = () => {
    // 清除用户登录状态
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    // 跳转到登录页
    window.location.href = '/login';
    message.success('退出登录成功');
  };

  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<SettingOutlined />}>
        <Link to="/user/settings">个人设置</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  // 获取当前用户信息
  const getUserInfo = () => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        return JSON.parse(userInfoStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const userInfo = getUserInfo();

  return (
    <Layout className="main-layout">
      <Header className="main-header">
        <div className="header-left" onClick={toggleCollapsed}>
          <MenuOutlined className="trigger" />
          <span className="logo">阿克苏智慧农业数字化运营管理平台</span>
        </div>
        <div className="header-right">
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div className="user-info">
              <Avatar icon={<UserOutlined />} />
              <span className="user-name">{userInfo ? userInfo.username : '管理员'}</span>
            </div>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider
          width={250}
          theme="light"
          collapsible
          collapsed={collapsed}
          className="main-sider"
          trigger={null}
        >
          <SideMenu />
        </Sider>
        <Layout className="main-content-wrapper">
          <Content className="main-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};



export default LayoutComponent;