# 配置中心服务 (config-service)

## 概述
该服务是基于Spring Cloud Config的配置中心，用于集中管理所有微服务的配置文件。

## 功能特点
- 集中管理配置文件
- 支持配置动态刷新
- 支持版本管理（后续可扩展到Git仓库）
- 高可用设计（后续可扩展）

## 目录结构
```
config-service
├── pom.xml                  # Maven依赖配置
├── src/main/java            # Java源代码
│   └── com/example/configservice
│       └── ConfigServiceApplication.java  # 启动类
├── src/main/resources       # 资源文件
│   ├── application.yml      # 应用配置
│   └── configs              # 配置文件存储目录
│       ├── api-gateway.yml  # API网关配置
│       └── auth-service.yml # 认证服务配置
└── README.md                # 说明文档
```

## 启动说明
1. 确保已安装JDK 17和Maven
2. 进入项目根目录
3. 执行以下命令启动服务：
   ```
   mvn spring-boot:run
   ```
4. 服务将在端口8888启动

## 访问配置
配置中心启动后，可以通过以下URL访问配置：
- API网关配置: http://localhost:8888/api-gateway/default
- 认证服务配置: http://localhost:8888/auth-service/default

## 后续扩展
1. 切换到Git仓库存储配置
2. 实现配置中心高可用
3. 集成配置刷新机制
4. 添加配置校验功能