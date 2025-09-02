// src/api/tenant.js
import request from '../utils/request';

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
 * 获取租户列表
 * @returns {Promise}
 */
export const getTenants = () => {
  // 模拟API延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: mockTenants.filter(tenant => tenant.status === 1) // 只返回启用的租户
      });
    }, 300);
  });
};

/**
 * 获取租户详情
 * @param {number} id - 租户ID
 * @returns {Promise}
 */
export const getTenantById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tenant = mockTenants.find(t => t.id === id);
      if (tenant) {
        resolve({ data: tenant });
      } else {
        reject({
          response: {
            status: 404,
            data: { message: '租户不存在' }
          }
        });
      }
    }, 300);
  });
};

/**
 * 创建租户
 * @param {object} data - 租户数据
 * @returns {Promise}
 */
export const createTenant = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTenant = {
        id: mockTenants.length + 1,
        ...data,
        status: 1,
        createdAt: new Date().toLocaleString('zh-CN'),
        updatedAt: new Date().toLocaleString('zh-CN')
      };
      mockTenants.push(newTenant);
      resolve({ data: newTenant });
    }, 500);
  });
};

/**
 * 更新租户
 * @param {number} id - 租户ID
 * @param {object} data - 更新的租户数据
 * @returns {Promise}
 */
export const updateTenant = (id, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTenants.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTenants[index] = {
          ...mockTenants[index],
          ...data,
          updatedAt: new Date().toLocaleString('zh-CN')
        };
        resolve({ data: mockTenants[index] });
      } else {
        reject({
          response: {
            status: 404,
            data: { message: '租户不存在' }
          }
        });
      }
    }, 500);
  });
};

/**
 * 获取租户用户列表
 * @param {number} id - 租户ID
 * @returns {Promise}
 */
export const getTenantUsers = (id) => {
  // 模拟租户用户数据
  const mockTenantUsers = [
    { id: 2, username: 'user1', name: '用户1', email: 'user1@example.com', role: 'USER' },
    { id: 4, username: 'test', name: '测试用户', email: 'test@example.com', role: 'GUEST' }
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockTenantUsers });
    }, 300);
  });
};

/**
 * 删除租户
 * @param {number} id - 租户ID
 * @returns {Promise}
 */
export const deleteTenant = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTenants.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTenants.splice(index, 1);
        resolve({ success: true });
      } else {
        reject({
          response: {
            status: 404,
            data: { message: '租户不存在' }
          }
        });
      }
    }, 500);
  });
};

/**
 * 更改租户状态
 * @param {number} id - 租户ID
 * @param {number} status - 状态值(0:禁用, 1:启用)
 * @returns {Promise}
 */
export const changeTenantStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTenants.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTenants[index].status = status;
        mockTenants[index].updatedAt = new Date().toLocaleString('zh-CN');
        resolve({ data: mockTenants[index] });
      } else {
        reject({
          response: {
            status: 404,
            data: { message: '租户不存在' }
          }
        });
      }
    }, 300);
  });
};