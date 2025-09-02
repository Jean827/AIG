// src/api/emailConfig.js
import request from '../utils/request';

/**
 * 获取邮件服务器配置
 * @returns {Promise}
 */
export const getEmailConfig = () => {
  return request({
    url: '/email/config',
    method: 'GET'
  });
};

/**
 * 更新邮件服务器配置
 * @param {object} data - 邮件配置信息
 * @returns {Promise}
 */
export const updateEmailConfig = (data) => {
  return request({
    url: '/email/config',
    method: 'PUT',
    data
  });
};

/**
 * 测试邮件服务器配置
 * @param {object} data - 测试邮件配置
 * @returns {Promise}
 */
export const testEmailConfig = (data) => {
  return request({
    url: '/email/test',
    method: 'POST',
    data
  });
};