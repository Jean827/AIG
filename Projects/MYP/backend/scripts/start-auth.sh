#!/bin/bash

# 启动auth-service服务的脚本

# 日志目录
LOG_DIR="/Users/Data/AIG/Projects/MYP/backend/logs"
mkdir -p $LOG_DIR

# 启动auth-service
cd /Users/Data/AIG/Projects/MYP/backend/auth-service
nohup mvn spring-boot:run > $LOG_DIR/auth-service.log 2>&1 &
echo "auth-service 已启动，日志文件: $LOG_DIR/auth-service.log"