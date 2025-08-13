#!/bin/bash

# 启动tenant-service服务的脚本

# 日志目录
LOG_DIR="/Users/Data/AIG/Projects/MYP/backend/logs"
mkdir -p $LOG_DIR

# 启动tenant-service
cd /Users/Data/AIG/Projects/MYP/backend/tenant-service
nohup mvn spring-boot:run > $LOG_DIR/tenant-service.log 2>&1 &
echo "tenant-service 已启动，日志文件: $LOG_DIR/tenant-service.log"