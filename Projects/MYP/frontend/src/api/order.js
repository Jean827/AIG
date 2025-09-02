import request from './request';

// 获取订单列表
export const getOrders = async (params = {}) => {
  return await request.get('/api/orders', { params });
};

// 获取订单详情
export const getOrderById = async (id) => {
  return await request.get(`/api/orders/${id}`);
};

// 创建订单
export const createOrder = async (orderData) => {
  return await request.post('/api/orders', orderData);
};

// 更新订单
export const updateOrder = async (id, orderData) => {
  return await request.put(`/api/orders/${id}`, orderData);
};

// 取消订单
export const cancelOrder = async (id) => {
  return await request.put(`/api/orders/${id}/cancel`);
};

// 搜索订单
export const searchOrders = async (query) => {
  return await request.get('/api/orders/search', { params: { query } });
};