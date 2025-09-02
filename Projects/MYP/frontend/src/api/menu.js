// src/api/menu.js
import request from '../utils/request';

/**
 * 获取菜单列表
 * @returns {Promise}
 */
export const getMenus = () => {
  return request({
    url: '/api/menus',
    method: 'GET'
  });
};

/**
 * 创建菜单
 * @param {object} data - 菜单信息
 * @returns {Promise}
 */
export const createMenu = (data) => {
  return request({
    url: '/api/menus',
    method: 'POST',
    data
  });
};

/**
 * 更新菜单
 * @param {string} id - 菜单ID
 * @param {object} data - 菜单信息
 * @returns {Promise}
 */
export const updateMenu = (id, data) => {
  return request({
    url: `/api/menus/${id}`,
    method: 'PUT',
    data
  });
};

/**
 * 删除菜单
 * @param {string} id - 菜单ID
 * @returns {Promise}
 */
export const deleteMenu = (id) => {
  return request({
    url: `/api/menus/${id}`,
    method: 'DELETE'
  });
};

/**
 * 刷新菜单（从系统中自动加载）
 * @returns {Promise}
 */
export const refreshMenus = () => {
  return request({
    url: '/api/menus/refresh',
    method: 'POST'
  });
};

/**
 * 获取菜单树（用于级联选择）
 * @returns {Promise}
 */
export const getMenuTree = () => {
  return request({
    url: '/api/menus/tree',
    method: 'GET'
  });
};