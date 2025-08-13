#!/bin/bash

# 启动api-gateway服务的脚本

# 日志目录
LOG_DIR="/Users/Data/AIG/Projects/MYP/backend/logs"
mkdir -p $LOG_DIR

# 启动api-gateway
cd /Users/Data/AIG/Projects/MYP/backend/api-gateway
nohup mvn spring-boot:run > $LOG_DIR/api-gateway.log 2>&1 &
echo "api-gateway 已启动，日志文件: $LOG_DIR/api-gateway.log"