import React from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import SiderLayout from './components/layout/SiderLayout';
import './App.css';

const { Content, Footer } = Layout;

function App() {
  const location = useLocation();
  
  // 定义不需要显示侧边栏的公共路由
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ];
  
  // 检查当前路由是否为公共路由
  const isPublicRoute = publicRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  );

  return (
    <Layout className="app-container">
      {!isPublicRoute ? (
        // 对于受保护的路由，显示完整的布局（包含侧边栏菜单）
        <>
          <SiderLayout />
          <Layout>
            <Content className="content">
              <div className="main-content">
                <Outlet />
              </div>
            </Content>
            <Footer className="footer">
              MYP ©{new Date().getFullYear()} Created by AIG
            </Footer>
          </Layout>
        </>
      ) : (
        // 对于公共路由（如登录页），只显示内容区域，不显示侧边栏菜单
        <Layout>
          <Content className="content">
            <div className="public-content">
              <Outlet />
            </div>
          </Content>
        </Layout>
      )}
    </Layout>
  );
}

export default App;
