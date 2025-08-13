# MYP项目架构与开发指南

## 项目概述
MYP是一个基于微服务架构的多租户云平台，提供租户管理、用户认证、产品管理和订单管理等核心功能。

## 系统架构
![系统架构图](https://example.com/system-architecture.png)（示意图）

### 微服务组件
1. **eureka-server**：服务注册与发现中心（端口：8761）
2. **api-gateway**：API网关（端口：8080）
3. **auth-service**：认证授权服务（端口：8081）
4. **tenant-service**：租户管理服务（端口：8082）
5. **user-service**：用户管理服务（端口：8083）
6. **product-service**：产品管理服务（端口：8084）
7. **order-service**：订单管理服务（端口：8085）

## 技术栈
- **后端**：Spring Boot 3.2.3, Spring Cloud 2023.0.1, Spring Security, Spring Data JPA
- **数据库**：MySQL 8.0, Redis 6.0+
- **前端**：React 18, Ant Design, Redux Toolkit, React Router
- **服务发现**：Netflix Eureka
- **API网关**：Spring Cloud Gateway
- **构建工具**：Maven, npm

## 开发环境搭建
### 前提条件
- JDK 17+
- Maven 3.8+
- MySQL 8.0+
- Redis 6.0+
- Node.js 18+
- npm 9+

### 数据库准备
1. 创建以下数据库：
   - auth_service
   - tenant_service
   - user_service
   - product_service
   - order_service
2. 为每个数据库创建用户并授予权限

### 服务启动顺序
1. 启动eureka-server
2. 启动api-gateway
3. 启动auth-service
4. 启动tenant-service
5. 启动user-service
6. 启动product-service
7. 启动order-service
8. 启动frontend

## 服务启动命令
### 后端服务
```bash
# 启动eureka-server
cd backend/eureka-server
mvn spring-boot:run

# 启动api-gateway
cd backend/api-gateway
mvn spring-boot:run

# 启动auth-service
cd backend/auth-service
mvn spring-boot:run

# 以此类推启动其他服务
```

### 前端服务
```bash
cd frontend
npm install
npm run dev
```

## API文档
API文档可在服务启动后通过以下地址访问：
- Swagger UI: http://localhost:8080/swagger-ui.html

## 开发规范
1. 代码规范：遵循Google Java Style Guide
2. 提交规范：使用语义化版本管理
3. 分支策略：采用Git Flow工作流
4. 代码审查：所有代码变更必须经过Pull Request审查

## 联系我们
如有任何问题，请联系项目团队：team@example.com