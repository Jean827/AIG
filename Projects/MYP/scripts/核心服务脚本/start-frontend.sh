#!/bin/bash
# 前端服务启动脚本
# 版本: v1.0
# 遵循开发管理计划 (04-开发管理计划.md) 中的脚本使用规范

# 配置文件路径
CONFIG_FILE="${PWD}/../../config/environment-config.yml"

# 默认端口配置
FRONTEND_PORT=3000

# 日志文件路径
FRONTEND_LOG="${PWD}/../../logs/frontend.log"

# 从配置文件读取端口（如果配置文件存在）
if [ -f "${CONFIG_FILE}" ]; then
    echo "从配置文件读取前端服务配置..."
    # 使用yq工具解析yaml配置（假设已安装）
    if command -v yq &> /dev/null; then
        FRONTEND_PORT=$(yq eval '.frontend.port' "${CONFIG_FILE}")
        echo "已读取前端服务端口: ${FRONTEND_PORT}"
    else
        echo "警告: yq工具未安装，使用默认端口: ${FRONTEND_PORT}"
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

# 启动前端服务
start_frontend() {
    echo "正在启动前端服务..."

    # 检查和释放端口
    check_and_release_port ${FRONTEND_PORT} "前端服务"

    # 启动前端服务
    cd ${PWD}/../../frontend
    nohup npm start > ${FRONTEND_LOG} 2>&1 &
    FRONTEND_PID=$!
    echo "前端服务已启动，PID: ${FRONTEND_PID}"

    # 等待服务启动
    sleep 5

    # 检查服务是否启动成功
    if ! curl -s http://localhost:${FRONTEND_PORT} | grep -q "<title>"
    then
        echo "警告: 前端服务启动可能未成功，请查看日志: ${FRONTEND_LOG}"
    else
        echo "前端服务启动成功"
        echo "前端服务访问地址: http://localhost:${FRONTEND_PORT}"
    fi

    cd -
}

# 执行启动
start_frontend