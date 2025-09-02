// src/api/auth.js
import request from '../utils/request';

// 租户和用户模拟数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    name: '超级管理员',
    tenantId: null, // 超级管理员不属于任何租户
    tenantName: null,
    roles: [
      {
        id: 1,
        name: 'ADMIN',
        permissions: ['TENANT_MANAGE', 'USER_MANAGE', 'PRODUCT_MANAGE', 'ORDER_MANAGE']
      }
    ]
  },
  {
    id: 2,
    username: 'user1',
    password: 'user123',
    email: 'user1@example.com',
    name: '用户1',
    tenantId: 1,
    tenantName: '租户A',
    roles: [
      {
        id: 2,
        name: 'USER',
        permissions: ['PRODUCT_VIEW', 'ORDER_CREATE']
      }
    ]
  },
  {
    id: 3,
    username: 'user2',
    password: 'user234',
    email: 'user2@example.com',
    name: '用户2',
    tenantId: 2,
    tenantName: '租户B',
    roles: [
      {
        id: 2,
        name: 'USER',
        permissions: ['PRODUCT_VIEW', 'ORDER_CREATE']
      }
    ]
  },
  {
    id: 4,
    username: 'test',
    password: 'test123',
    email: 'test@example.com',
    name: '测试用户',
    tenantId: 1,
    tenantName: '租户A',
    roles: [
      {
        id: 3,
        name: 'GUEST',
        permissions: ['PRODUCT_VIEW']
      }
    ]
  }
];

// 模拟租户数据
const mockTenants = [
  {
    id: 1,
    name: '租户A',
    code: 'TENANT_A',
    contactPerson: '张三',
    contactPhone: '13800138001',
    contactEmail: 'contact@tenant-a.com',
    status: 1,
    createdAt: '2023-01-01 10:00:00',
    updatedAt: '2023-02-01 14:30:00'
  },
  {
    id: 2,
    name: '租户B',
    code: 'TENANT_B',
    contactPerson: '李四',
    contactPhone: '13900139002',
    contactEmail: 'contact@tenant-b.com',
    status: 1,
    createdAt: '2023-01-15 11:00:00',
    updatedAt: '2023-02-15 15:30:00'
  },
  {
    id: 3,
    name: '租户C',
    code: 'TENANT_C',
    contactPerson: '王五',
    contactPhone: '13700137003',
    contactEmail: 'contact@tenant-c.com',
    status: 0,
    createdAt: '2023-02-01 09:00:00',
    updatedAt: '2023-03-01 10:30:00'
  }
];

/**
 * 用户登录
 * @param {object} data - 登录信息
 * @returns {Promise}
 */
export const login = (data) => {
  // 直接在前端实现登录逻辑，模拟API响应
  return new Promise((resolve, reject) => {
    const { username, password, tenantCode } = data;
    
    // 查找用户
    let user = mockUsers.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return reject({
        response: {
          data: {
            message: '用户名或密码错误'
          }
        }
      });
    }
    
    // 处理租户登录
    if (tenantCode) {
      const tenant = mockTenants.find(t => t.code === tenantCode);
      
      if (!tenant) {
        return reject({
          response: {
            data: {
              message: '租户不存在'
            }
          }
        });
      }
      
      if (tenant.status !== 1) {
        return reject({
          response: {
            data: {
              message: '租户已禁用'
            }
          }
        });
      }
      
      // 检查用户是否属于该租户
      if (user.tenantId !== tenant.id && user.tenantId !== null) {
        return reject({
          response: {
            data: {
              message: '用户不属于指定租户'
            }
          }
        });
      }
      
      // 超级管理员可以访问任何租户
      if (user.tenantId === null) {
        user = {
          ...user,
          currentTenantId: tenant.id,
          currentTenantName: tenant.name,
          currentTenantCode: tenant.code
        };
      }
    } else if (user.tenantId !== null) {
      // 非超级管理员必须指定租户
      return reject({
        response: {
          data: {
            message: '请指定租户'
          }
        }
      });
    }
    
    // 生成模拟token
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    // 返回登录成功响应
    resolve({
      token,
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId,
      tenantName: user.tenantName,
      currentTenantId: user.currentTenantId || user.tenantId,
      currentTenantName: user.currentTenantName || user.tenantName,
      currentTenantCode: user.currentTenantCode,
      roles: user.roles
    });
  });
};

/**
 * 用户注册
 * @param {object} data - 注册信息
 * @returns {Promise}
 */
export const register = (data) => {
  return request({
    url: '/auth/signup',
    method: 'POST',
    data
  });
};

/**
 * 获取用户信息
 * @returns {Promise}
 */
export const getUserInfo = () => {
  // 从localStorage获取用户信息，模拟API响应
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return Promise.resolve({
      data: user
    });
  }
  
  return Promise.reject({
    response: {
      status: 401,
      data: {
        message: '未授权'
      }
    }
  });
};

/**
 * 用户登出
 * @returns {Promise}
 */
export const logout = () => {
  // 由于后端没有实现logout端点，这里只返回一个成功的Promise
  return Promise.resolve({ success: true });
};

/**
 * 忘记密码
 * @param {object} data - 包含邮箱的对象
 * @returns {Promise}
 */
export const forgotPassword = (data) => {
  return request({
    url: '/auth/forgot-password',
    method: 'POST',
    data
  });
};

/**
 * 重置密码
 * @param {object} data - 包含重置token和新密码的对象
 * @returns {Promise}
 */
export const resetPassword = (data) => {
  return request({
    url: '/auth/reset-password',
    method: 'POST',
    data
  });
};