# 开发环境脚本使用说明

## 概述
本目录包含开发环境所需的各种脚本，遵循开发管理计划 (04-开发管理计划.md) 中的脚本体系管理规范。

## 目录结构
```
scripts/
├── quick-start-dev.sh         # 快速启动开发环境脚本
├── update-progress.sh         # 更新项目进度脚本
└── database/
    └── init-database.sql      # 数据库初始化脚本
```

## 脚本详细说明

### 快速启动开发环境脚本 (quick-start-dev.sh)

**功能**: 一键启动完整的开发环境，包括后端服务、前端服务和数据库服务。

**特点**:
- 环境检查：自动检查 Java、Node.js、npm 和 Docker 是否安装
- 端口管理：自动检测并释放占用的端口
- 配置集成：从 config/environment-config.yml 获取配置
- 健康检查：服务启动后的状态检查
- 状态监控：查看服务状态和日志

**使用方法**:
```bash
# 启动开发环境（默认）
./quick-start-dev.sh

# 查看服务状态
./quick-start-dev.sh --status 或 ./quick-start-dev.sh -s

# 查看服务日志
./quick-start-dev.sh --logs 或 ./quick-start-dev.sh -l

# 停止所有服务
./quick-start-dev.sh --kill 或 ./quick-start-dev.sh -k

# 重启所有服务
./quick-start-dev.sh --restart 或 ./quick-start-dev.sh -r

# 显示帮助信息
./quick-start-dev.sh --help 或 ./quick-start-dev.sh -h
```

### 更新项目进度脚本 (update-progress.sh)

**功能**: 更新项目进度报告。

**使用方法**:
```bash
# 运行脚本
./update-progress.sh
```

### 数据库初始化脚本 (database/init-database.sql)

**功能**: 初始化数据库表结构和测试数据。

**使用方法**:
- 脚本会在数据库服务启动时自动执行
- 也可以手动在数据库客户端中执行

## 配置文件
环境配置文件位于 `config/environment-config.yml`，包含服务端口、数据库连接信息等配置。

## 注意事项
1. 所有脚本必须具有执行权限 (`chmod +x script-name.sh`)
2. 确保 Docker 服务已启动
3. 首次运行前请检查配置文件是否正确
4. 脚本运行过程中遇到问题，请查看日志文件 (`logs/` 目录下)

## 遵循规范
- 脚本体系管理规范 (开发管理计划 第4章)
- 配置管理规范 (开发管理计划 第3.2节)
- API调用路径统一配置管理规范 (开发管理计划 第3.3节)