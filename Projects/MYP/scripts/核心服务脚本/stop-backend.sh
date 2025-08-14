#!/bin/bash
# 后端服务停止脚本
# 版本: v1.0
# 遵循开发管理计划 (04-开发管理计划.md) 中的脚本使用规范

# 配置文件路径
CONFIG_FILE="${PWD}/../../config/environment-config.yml"

# 默认端口配置
BACKEND_PORT=8080

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

# 停止后端服务
stop_backend() {
    echo "正在停止后端服务..."

    # 检查后端服务是否在运行
    if lsof -i :${BACKEND_PORT} &> /dev/null
    then
        # 杀死占用端口的进程
        kill -9 $(lsof -t -i :${BACKEND_PORT})
        echo "后端服务已停止"
    else
        echo "后端服务未运行"
    fi
}

# 执行停止
stop_backend