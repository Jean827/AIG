// 组件加载工具，用于动态加载页面组件

// 使用React.lazy实现组件的懒加载
import React, { lazy, Suspense } from 'react';
import { Spin } from 'antd';

// 创建一个默认的加载中组件
const LoadingComponent = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '16px',
    color: '#1890ff'
  }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

// 动态加载组件的高阶组件
export const lazyLoadComponent = (importFunction) => {
  const LazyComponent = lazy(importFunction);
  
  return (props) => (
    <Suspense fallback={<LoadingComponent />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// 页面组件映射
const pageComponents = {
  // 系统管理
  '/system/menu': lazyLoadComponent(() => import('../pages/system/MenuManagement')),
  '/system/user': lazyLoadComponent(() => import('../pages/system/UserManagement')),
  '/system/role': lazyLoadComponent(() => import('../pages/system/RoleManagement')),
  '/system/organization': lazyLoadComponent(() => import('../pages/system/OrganizationManagement')),
  '/system/dictionary': lazyLoadComponent(() => import('../pages/system/DictionaryManagement')),
  
  // 基础信息管理
  '/basic/farmer': lazyLoadComponent(() => import('../pages/basic/FarmerManagement')),
  '/basic/land': lazyLoadComponent(() => import('../pages/basic/LandInformation')),
  
  // 土地竞拍管理
  '/auction/info': lazyLoadComponent(() => import('../pages/auction/AuctionInformation')),
  '/auction/record': lazyLoadComponent(() => import('../pages/auction/AuctionRecord')),
  
  // 合同管理
  '/contract/info': lazyLoadComponent(() => import('../pages/contract/ContractInformation')),
  '/contract/execution': lazyLoadComponent(() => import('../pages/contract/ContractExecution')),
  
  // 收费管理
  '/payment/search': lazyLoadComponent(() => import('../pages/payment/PaymentSearch')),
  '/payment/operation': lazyLoadComponent(() => import('../pages/payment/PaymentOperation')),
  '/payment/history': lazyLoadComponent(() => import('../pages/payment/PaymentHistory')),
  
  // 融资与确权管理
  '/finance/info': lazyLoadComponent(() => import('../pages/finance/FinanceInformation')),
  '/finance/monitor': lazyLoadComponent(() => import('../pages/finance/FundMonitoring')),
  
  // 个人设置
  '/user/settings': lazyLoadComponent(() => import('../pages/user/Settings'))
};

// 获取页面组件
export const getPageComponent = (path) => {
  return pageComponents[path] || null;
};

// 创建页面组件
export const createPageComponent = (path, importFunction) => {
  pageComponents[path] = lazyLoadComponent(importFunction);
};

// 获取所有页面路径
export const getPagePaths = () => {
  return Object.keys(pageComponents);
};