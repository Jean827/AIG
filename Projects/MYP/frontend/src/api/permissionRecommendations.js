import axios from 'axios';

const API_URL = '/api/permission-recommendations';

// 获取当前用户的权限推荐
const getPermissionRecommendations = (includeApplied = false) => {
  return axios.get(`${API_URL}?includeApplied=${includeApplied}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

// 生成新的权限推荐
const generatePermissionRecommendations = () => {
  return axios.post(`${API_URL}/generate`, {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

// 应用权限推荐
const applyPermissionRecommendation = (recommendationId) => {
  return axios.post(`${API_URL}/${recommendationId}/apply`, {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

// 拒绝权限推荐
const declinePermissionRecommendation = (recommendationId) => {
  return axios.post(`${API_URL}/${recommendationId}/decline`, {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

// 获取权限预测
const getPermissionPredictions = () => {
  return axios.get(`${API_URL}/predictions`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export default {
  getPermissionRecommendations,
  generatePermissionRecommendations,
  applyPermissionRecommendation,
  declinePermissionRecommendation,
  getPermissionPredictions
};