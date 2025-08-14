#!/bin/bash
# 后端服务启动脚本
# 版本: v1.0
# 遵循开发管理计划 (04-开发管理计划.md) 中的脚本使用规范

# 配置文件路径
CONFIG_FILE="${PWD}/../../config/environment-config.yml"

# 默认端口配置
BACKEND_PORT=8080

# 日志文件路径
BACKEND_LOG="${PWD}/../../logs/backend.log"

# 从配置文件读取端口（如果配置文件存在）
if [ -f "${CONFIG_FILE}" ]; then
    echo "从配置文件读取后端服务配置..."
    # 使用yq工具解析yaml配置（假设已安装）
    if command -v yq &> /dev/null; then
        BACKEND_PORT=$(yq eval '.backend.port' "${CONFIG_FILE}")
        echo "已读取后端服务端口: ${BACKEND_PORT}"
    else
        echo "警告: yq工具未安装，使用默认端口: ${BACKEND_PORT}"
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

# 启动后端服务
start_backend() {
    echo "正在启动后端服务..."

    # 检查和释放端口
    check_and_release_port ${BACKEND_PORT} "后端服务"

    # 启动后端服务
    cd ${PWD}/../../backend
    nohup ./mvnw spring-boot:run > ${BACKEND_LOG} 2>&1 &
    BACKEND_PID=$!
    echo "后端服务已启动，PID: ${BACKEND_PID}"

    # 等待服务启动
    sleep 10

    # 检查服务是否启动成功
    if ! curl -s http://localhost:${BACKEND_PORT}/actuator/health | grep -q "UP"
    then
        echo "警告: 后端服务启动可能未成功，请查看日志: ${BACKEND_LOG}"
    else
        echo "后端服务启动成功"
        echo "后端服务访问地址: http://localhost:${BACKEND_PORT}"
    fi

    cd -
}

# 执行启动
start_backend