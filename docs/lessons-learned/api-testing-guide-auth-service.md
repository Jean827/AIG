# 认证授权服务 API 测试指南

## 概述
本文档描述如何测试认证授权服务的核心功能，包括登录、刷新令牌和令牌黑名单管理。

## 测试环境
- 服务器地址: http://localhost:8081
- API 前缀: /api/auth

## 测试用例

### 1. 用户登录
**目的**: 验证用户登录并获取访问令牌和刷新令牌

**请求**: 
- 方法: POST
- URL: /signin
-  Headers: Content-Type: application/json
-  Body:
```json
{
  "username": "testuser",
  "password": "password"
}
```

**预期响应**: 
- 状态码: 200 OK
- 响应体包含: token (访问令牌), refreshToken (刷新令牌), 用户信息和角色

### 2. 刷新访问令牌
**目的**: 验证使用刷新令牌获取新的访问令牌

**请求**: 
- 方法: POST
- URL: /refresh-token
-  Headers: Content-Type: application/json
-  Body:
```json
{
  "refreshToken": "<登录时获取的刷新令牌>"
}
```

**预期响应**: 
- 状态码: 200 OK
- 响应体包含: 新的 token 和 refreshToken

### 3. 验证令牌黑名单功能
**目的**: 验证注销后令牌被加入黑名单，无法继续使用

**步骤**: 
1. 登录获取令牌
2. 调用注销接口 (假设存在) 或直接使令牌失效
3. 尝试使用已失效的令牌访问受保护资源

**预期结果**: 
- 使用已黑名单的令牌访问时，服务器返回 401 Unauthorized

## 测试工具
推荐使用 Postman 或 curl 进行测试。

## 注意事项
- 确保 Redis 服务已启动，因为刷新令牌和黑名单功能依赖 Redis
- 测试完成后，请清理测试数据