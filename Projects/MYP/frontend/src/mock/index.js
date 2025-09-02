// Mock数据服务器配置
import { viteMockServe } from 'vite-plugin-mock';

// 导入mock数据
import authMock from './auth';

// 创建mock服务
export function createMockServer() {
  return viteMockServe({
    mockPath: './src/mock',
    supportTs: false,
    watchFiles: true,
    localEnabled: true,
    prodEnabled: true,
    injectCode: `
      import { setupProdMockServer } from './src/mock/index.js';
      setupProdMockServer();
    `,
  });
}

// 创建生产环境mock服务
export function setupProdMockServer() {
  const { createProdMockServer } = require('vite-plugin-mock/es/createProdMockServer');
  createProdMockServer([...authMock]);
}

// 导出默认函数
export default createMockServer;