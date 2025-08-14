# 微服务配置中心使用说明

## 配置中心介绍
配置中心用于集中管理所有微服务的配置，实现配置的动态更新和版本控制，避免了每个服务单独维护配置文件的复杂性。

## 目录结构
```
/backend
  /config-service       # 配置中心服务
    /src/main/resources
      /configs          # 存放各服务配置文件的目录
        eureka-server.yml
        api-gateway.yml
        auth-service.yml
        tenant-service.yml
        user-service.yml
        product-service.yml
        order-service.yml
  /scripts
    start-all.sh        # 启动所有服务的脚本
    verify-config.sh    # 验证配置中心和服务配置的脚本
  /eureka-server       # 服务注册中心
  /api-gateway         # API网关服务
  /auth-service        # 认证服务
  /tenant-service      # 租户服务
  /user-service        # 用户服务
  /product-service     # 产品服务
  /order-service       # 订单服务
```

## 启动服务
1. 确保已编译所有服务
2. 运行启动脚本：
   ```bash
   cd /Users/Data/AIG/Projects/MYP/backend/scripts
   ./start-all.sh
   ```
3. 启动脚本会按照以下顺序启动服务：
   - 配置中心 (config-service) - 端口8888
   - 服务注册中心 (eureka-server) - 端口8761
   - API网关 (api-gateway) - 端口8080
   - 认证服务 (auth-service) - 端口8081
   - 租户服务 (tenant-service) - 端口8082
   - 用户服务 (user-service) - 端口8083
   - 产品服务 (product-service) - 端口8084
   - 订单服务 (order-service) - 端口8085

## 验证配置
1. 确保所有服务已启动
2. 运行验证脚本：
   ```bash
   cd /Users/Data/AIG/Projects/MYP/backend/scripts
   ./verify-config.sh
   ```
3. 验证脚本会检查配置中心是否正常工作，并验证各服务的配置是否正确加载

## 访问配置
配置中心URL: http://localhost:8888

各服务配置访问方式：
- eureka-server: http://localhost:8888/eureka-server/default
- api-gateway: http://localhost:8888/api-gateway/default
- auth-service: http://localhost:8888/auth-service/default
- tenant-service: http://localhost:8888/tenant-service/default
- user-service: http://localhost:8888/user-service/default
- product-service: http://localhost:8888/product-service/default
- order-service: http://localhost:8888/order-service/default

## 配置动态刷新
1. 修改配置中心中的配置文件
2. 发送POST请求到对应服务的刷新端点：
   ```bash
   curl -X POST http://localhost:{service-port}/actuator/refresh
   ```
3. 例如，刷新订单服务配置：
   ```bash
   curl -X POST http://localhost:8085/actuator/refresh
   ```

## 故障排除
1. 如果配置中心启动失败，检查端口8888是否被占用
2. 如果服务无法从配置中心获取配置，检查：
   - 配置中心是否正常运行
   - 服务的bootstrap.yml文件中的配置中心URL是否正确
   - 配置中心中是否存在该服务的配置文件
3. 如果验证脚本失败，检查错误信息，确认问题出在哪个服务的配置上

## 下一步建议
1. 配置中心高可用部署：在生产环境中，建议部署多个配置中心实例
2. 使用Git存储配置：将配置文件存储在Git仓库中，实现版本控制和配置追踪
3. 配置权限管理：为不同环境和团队设置配置访问权限
4. 配置加密：对敏感配置信息（如数据库密码）进行加密存储