#!/bin/bash
# 数据库服务启动脚本
# 版本: v1.0
# 遵循开发管理计划 (04-开发管理计划.md) 中的脚本使用规范

# 配置文件路径
CONFIG_FILE="${PWD}/../../config/environment-config.yml"

# 默认端口配置
DATABASE_PORT=3306

# 日志文件路径
DATABASE_LOG="${PWD}/../../logs/database.log"

# 从配置文件读取配置（如果配置文件存在）
if [ -f "${CONFIG_FILE}" ]; then
    echo "从配置文件读取数据库服务配置..."
    # 使用yq工具解析yaml配置（假设已安装）
    if command -v yq &> /dev/null; then
        DATABASE_PORT=$(yq eval '.database.port' "${CONFIG_FILE}")
        echo "已读取数据库服务端口: ${DATABASE_PORT}"
    else
        echo "警告: yq工具未安装，使用默认端口: ${DATABASE_PORT}"
    fi
fi

# 端口检查和释放
check_and_release_port() {
    local port=$1
    local service=$2

    echo "检查 ${service} 端口 ${port}..."

    # 检查端口是否被占用
    if lsof -i :${port} &> /dev/null
    then
        echo "警告: ${service} 端口 ${port} 已被占用，尝试释放..."
        # 杀死占用端口的进程
        kill -9 $(lsof -t -i :${port})
        echo "${service} 端口 ${port} 已释放"
    else
        echo "${service} 端口 ${port} 可用"
    fi
}

# 启动数据库服务
start_database() {
    echo "正在启动数据库服务..."

    # 检查和释放端口
    check_and_release_port ${DATABASE_PORT} "数据库服务"

    # 启动数据库服务 (使用Docker)
    if [ -f "${PWD}/../../docker-compose.yml" ]; then
        docker-compose -f ${PWD}/../../docker-compose.yml up -d database
        echo "数据库服务已启动"
    else
        echo "错误: docker-compose.yml 文件不存在"
        exit 1
    fi

    # 等待服务启动
    sleep 10

    # 检查服务是否启动成功
    if ! docker ps | grep -q "database";
    then
        echo "警告: 数据库服务启动可能未成功，请查看 Docker 日志"
    else
        echo "数据库服务启动成功"
        echo "数据库服务访问地址: localhost:${DATABASE_PORT}"
    fi
}

# 执行启动
start_database