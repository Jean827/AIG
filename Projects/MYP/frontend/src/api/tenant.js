// src/api/tenant.js
import request from '../utils/request';

/**
 * 获取租户列表
 * @returns {Promise}
 */
export const getTenants = () => {
  return request({
    url: '/api/tenants',
    method: 'GET'
  });
};

/**
 * 获取租户详情
 * @param {number} id - 租户ID
 * @returns {Promise}
 */
export const getTenantById = (id) => {
  return request({
    url: `/api/tenants/${id}`,
    method: 'GET'
  });
};

/**
 * 创建租户
 * @param {object} data - 租户数据
 * @returns {Promise}
 */
export const createTenant = (data) => {
  return request({
    url: '/api/tenants',
    method: 'POST',
    data
  });
};

/**
 * 更新租户
 * @param {number} id - 租户ID
 * @param {object} data - 更新的租户数据
 * @returns {Promise}
 */
export const updateTenant = (id, data) => {
  return request({
    url: `/api/tenants/${id}`,
    method: 'PUT',
    data
  });
};

/**
 * 删除租户
 * @param {number} id - 租户ID
 * @returns {Promise}
 */
export const deleteTenant = (id) => {
  return request({
    url: `/api/tenants/${id}`,
    method: 'DELETE'
  });
};

/**
 * 更改租户状态
 * @param {number} id - 租户ID
 * @param {number} status - 状态值(0:禁用, 1:启用)
 * @returns {Promise}
 */
export const changeTenantStatus = (id, status) => {
  return request({
    url: `/api/tenants/${id}/status/${status}`,
    method: 'PATCH'
  });
};