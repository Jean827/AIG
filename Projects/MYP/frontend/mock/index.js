// mock/index.js
// Vite的mock服务插件
import authMock, { modifyRegisterForSuperAdmin, mockForgotPassword, mockResetPassword } from './auth';

// 分类模拟数据
const mockCategories = [
  { id: 1, name: '电子产品', description: '各类电子设备', createdAt: '2023-01-01 10:00:00', updatedAt: '2023-01-01 10:00:00' },
  { id: 2, name: '服装鞋帽', description: '各类服装和鞋类产品', createdAt: '2023-01-02 14:30:00', updatedAt: '2023-01-02 14:30:00' },
  { id: 3, name: '食品饮料', description: '各类食品和饮料', createdAt: '2023-01-03 09:15:00', updatedAt: '2023-01-03 09:15:00' },
  { id: 4, name: '家居用品', description: '各类家居生活产品', createdAt: '2023-01-04 16:45:00', updatedAt: '2023-01-04 16:45:00' },
  { id: 5, name: '图书音像', description: '各类图书和音像制品', createdAt: '2023-01-05 11:20:00', updatedAt: '2023-01-05 11:20:00' },
];

// 租户模拟数据
const mockTenants = [
  {
    id: 1,
    name: '测试租户',
    code: 'test_tenant',
    contactPerson: '张三',
    contactPhone: '13800138000',
    email: 'test@example.com',
    status: 1,
    createdAt: '2023-01-01 10:00:00',
    updatedAt: '2023-01-02 14:30:00',
    users: [
      { id: 1, username: 'tenant_admin', name: '租户管理员', email: 'admin@test.com', phone: '13900139000', status: 1 },
      { id: 2, username: 'tenant_user', name: '租户用户', email: 'user@test.com', phone: '13700137000', status: 1 }
    ]
  },
  {
    id: 2,
    name: '演示租户',
    code: 'demo_tenant',
    contactPerson: '李四',
    contactPhone: '13900139000',
    email: 'demo@example.com',
    status: 1,
    createdAt: '2023-01-03 09:15:00',
    updatedAt: '2023-01-03 09:15:00',
    users: []
  },
  {
    id: 3,
    name: '开发租户',
    code: 'dev_tenant',
    contactPerson: '王五',
    contactPhone: '13700137000',
    email: 'dev@example.com',
    status: 0,
    createdAt: '2023-01-05 16:45:00',
    updatedAt: '2023-01-10 11:20:00',
    users: []
  }
];

// 分类模拟API
const categoryMock = {
  getCategories: (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ data: mockCategories }));
  },

  getCategoryById: (req, res) => {
    const id = parseInt(req.url.split('/').pop());
    const category = mockCategories.find(c => c.id === id);

    if (category) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: category }));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: '分类不存在' }));
    }
  },

  createCategory: (req, res) => {
    const categoryData = req.body;
    const newCategory = {
      id: Date.now(),
      ...categoryData,
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN')
    };

    mockCategories.push(newCategory);
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ data: newCategory }));
  },

  updateCategory: (req, res) => {
    const id = parseInt(req.url.split('/').pop());
    const updateData = req.body;
    const categoryIndex = mockCategories.findIndex(c => c.id === id);

    if (categoryIndex !== -1) {
      mockCategories[categoryIndex] = {
        ...mockCategories[categoryIndex],
        ...updateData,
        updatedAt: new Date().toLocaleString('zh-CN')
      };

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: mockCategories[categoryIndex] }));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: '分类不存在' }));
    }
  },

  deleteCategory: (req, res) => {
    const id = parseInt(req.url.split('/').pop());
    const categoryIndex = mockCategories.findIndex(c => c.id === id);

    if (categoryIndex !== -1) {
      mockCategories.splice(categoryIndex, 1);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: '分类删除成功' }));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: '分类不存在' }));
    }
  },

  getProductsByCategoryId: (req, res) => {
    // 这里简化实现，实际项目中可能需要关联产品数据
    const urlParts = req.url.split('/');
    const categoryId = parseInt(urlParts[urlParts.length - 2]); // /api/categories/:id/products
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ data: [] })); // 返回空数组，实际项目中需要根据分类ID筛选产品
  }
};

// 租户模拟API
const tenantMock = {
  getTenants: (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ data: mockTenants }));
  },
  
  getTenantById: (req, res) => {
    const id = parseInt(req.url.split('/').pop());
    const tenant = mockTenants.find(t => t.id === id);
    
    if (tenant) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: tenant }));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: '租户不存在' }));
    }
  },
  
  createTenant: (req, res) => {
    const tenantData = req.body;
    const newTenant = {
      id: Date.now(),
      ...tenantData,
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN'),
      users: []
    };
    
    mockTenants.push(newTenant);
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ data: newTenant }));
  },
  
  updateTenant: (req, res) => {
    const id = parseInt(req.url.split('/').pop());
    const updateData = req.body;
    const tenantIndex = mockTenants.findIndex(t => t.id === id);
    
    if (tenantIndex !== -1) {
      mockTenants[tenantIndex] = {
        ...mockTenants[tenantIndex],
        ...updateData,
        updatedAt: new Date().toLocaleString('zh-CN')
      };
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: mockTenants[tenantIndex] }));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: '租户不存在' }));
    }
  },
  
  deleteTenant: (req, res) => {
    const id = parseInt(req.url.split('/').pop());
    const tenantIndex = mockTenants.findIndex(t => t.id === id);
    
    if (tenantIndex !== -1) {
      mockTenants.splice(tenantIndex, 1);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: '租户删除成功' }));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: '租户不存在' }));
    }
  },
  
  getTenantUsers: (req, res) => {
    const urlParts = req.url.split('/');
    const id = parseInt(urlParts[urlParts.length - 2]); // /api/tenants/:id/users
    const tenant = mockTenants.find(t => t.id === id);
    
    if (tenant) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: tenant.users }));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: '租户不存在' }));
    }
  },
  
  changeTenantStatus: (req, res) => {
    const urlParts = req.url.split('/');
    const id = parseInt(urlParts[urlParts.length - 3]); // /api/tenants/:id/status/:status
    const status = parseInt(urlParts[urlParts.length - 1]);
    const tenantIndex = mockTenants.findIndex(t => t.id === id);
    
    if (tenantIndex !== -1) {
      mockTenants[tenantIndex].status = status;
      mockTenants[tenantIndex].updatedAt = new Date().toLocaleString('zh-CN');
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: mockTenants[tenantIndex] }));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: '租户不存在' }));
    }
  }
};

// 创建mock服务插件
export default function createMockServer() {
  // 自动创建超级管理员账号Jean
  modifyRegisterForSuperAdmin();
  
  return {
    name: 'mock-server',
    configureServer(server) {
      // 注册认证相关的mock路由
      server.middlewares.use('/api/auth/register', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            req.body = JSON.parse(body);
            authMock.register(req, res);
          });
        } else {
          next();
        }
      });

      server.middlewares.use('/api/auth/login', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            req.body = JSON.parse(body);
            authMock.login(req, res);
          });
        } else {
          next();
        }
      });

      server.middlewares.use('/api/auth/me', (req, res, next) => {
        if (req.method === 'GET') {
          authMock.getUserInfo(req, res);
        } else {
          next();
        }
      });

      server.middlewares.use('/api/auth/logout', (req, res, next) => {
        if (req.method === 'POST') {
          authMock.logout(req, res);
        } else {
          next();
        }
      });
      
      // 忘记密码API
      server.middlewares.use('/api/auth/forgot-password', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            req.body = JSON.parse(body);
            mockForgotPassword(req, res);
          });
        } else {
          next();
        }
      });
      
      // 重置密码API
      server.middlewares.use('/api/auth/reset-password', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            req.body = JSON.parse(body);
            mockResetPassword(req, res);
          });
        } else {
          next();
        }
      });

      // 租户相关API
      server.middlewares.use('/api/tenants', (req, res, next) => {
        if (req.method === 'GET') {
          tenantMock.getTenants(req, res);
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            req.body = JSON.parse(body);
            tenantMock.createTenant(req, res);
          });
        } else {
          next();
        }
      });

      server.middlewares.use('/api/tenants/', (req, res, next) => {
        const urlParts = req.url.split('/');
        if (urlParts.length >= 4) {
          if (req.method === 'GET') {
            if (urlParts[4] === 'users') {
              tenantMock.getTenantUsers(req, res);
            } else {
              tenantMock.getTenantById(req, res);
            }
          } else if (req.method === 'PUT') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              req.body = JSON.parse(body);
              tenantMock.updateTenant(req, res);
            });
          } else if (req.method === 'DELETE') {
            tenantMock.deleteTenant(req, res);
          } else if (req.method === 'PATCH' && urlParts[4] === 'status') {
            tenantMock.changeTenantStatus(req, res);
          } else {
            next();
          }
        } else {
          next();
        }
      });

      // 分类相关API
      server.middlewares.use('/api/categories', (req, res, next) => {
        if (req.method === 'GET') {
          categoryMock.getCategories(req, res);
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            req.body = JSON.parse(body);
            categoryMock.createCategory(req, res);
          });
        } else {
          next();
        }
      });

      server.middlewares.use('/api/categories/', (req, res, next) => {
        const urlParts = req.url.split('/');
        if (urlParts.length >= 4) {
          if (req.method === 'GET') {
            if (urlParts[4] === 'products') {
              categoryMock.getProductsByCategoryId(req, res);
            } else {
              categoryMock.getCategoryById(req, res);
            }
          } else if (req.method === 'PUT') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              req.body = JSON.parse(body);
              categoryMock.updateCategory(req, res);
            });
          } else if (req.method === 'DELETE') {
            categoryMock.deleteCategory(req, res);
          } else {
            next();
          }
        } else {
          next();
        }
      });
    },
  };
}