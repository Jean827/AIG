import request from './request';

// 获取所有分类
export const getCategories = () => {
  return request.get('/api/categories');
};

// 获取分类详情
export const getCategoryById = (id) => {
  return request.get(`/api/categories/${id}`);
};

// 创建分类
export const createCategory = (data) => {
  return request.post('/api/categories', data);
};

// 更新分类
export const updateCategory = (id, data) => {
  return request.put(`/api/categories/${id}`, data);
};

// 删除分类
export const deleteCategory = (id) => {
  return request.delete(`/api/categories/${id}`);
};

// 获取分类下的产品
export const getProductsByCategoryId = (categoryId) => {
  return request.get(`/api/products/category/${categoryId}`);
};