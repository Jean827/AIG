#!/bin/bash
# 前端服务停止脚本
# 版本: v1.0
# 遵循开发管理计划 (04-开发管理计划.md) 中的脚本使用规范

# 配置文件路径
CONFIG_FILE="${PWD}/../../config/environment-config.yml"

# 默认端口配置
FRONTEND_PORT=3000

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

# 停止前端服务
stop_frontend() {
    echo "正在停止前端服务..."

    # 检查前端服务是否在运行
    if lsof -i :${FRONTEND_PORT} &> /dev/null
    then
        # 杀死占用端口的进程
        kill -9 $(lsof -t -i :${FRONTEND_PORT})
        echo "前端服务已停止"
    else
        echo "前端服务未运行"
    fi
}

# 执行停止
stop_frontend