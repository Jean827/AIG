import request from './request';

// 获取产品列表
export const getProducts = async () => {
  return await request.get('/api/products');
};

// 获取产品详情
export const getProductById = async (id) => {
  return await request.get(`/api/products/${id}`);
};

// 创建产品
export const createProduct = async (productData) => {
  return await request.post('/api/products', productData);
};

// 更新产品
export const updateProduct = async (id, productData) => {
  return await request.put(`/api/products/${id}`, productData);
};

// 删除产品
export const deleteProduct = async (id) => {
  return await request.delete(`/api/products/${id}`);
};

// 获取产品关联的订单数量
export const getProductOrderCount = async (id) => {
  return await request.get(`/api/products/${id}/orders/count`);
};