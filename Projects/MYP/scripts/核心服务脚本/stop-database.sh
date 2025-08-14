#!/bin/bash
# 数据库服务停止脚本
# 版本: v1.0
# 遵循开发管理计划 (04-开发管理计划.md) 中的脚本使用规范

# 停止数据库服务
stop_database() {
    echo "正在停止数据库服务..."

    # 检查数据库服务是否在运行
    if docker ps | grep -q "database";
    then
        # 停止数据库服务
        if [ -f "${PWD}/../../docker-compose.yml" ]; then
            docker-compose -f ${PWD}/../../docker-compose.yml down database
            echo "数据库服务已停止"
        else
            echo "错误: docker-compose.yml 文件不存在"
            exit 1
        fi
    else
        echo "数据库服务未运行"
    fi
}

# 执行停止
stop_database