#!/bin/bash

# 启动order-service服务的脚本

# 日志目录
LOG_DIR="/Users/Data/AIG/Projects/MYP/backend/logs"
mkdir -p $LOG_DIR

# 启动order-service
cd /Users/Data/AIG/Projects/MYP/backend/order-service
nohup mvn spring-boot:run > $LOG_DIR/order-service.log 2>&1 &
echo "order-service 已启动，日志文件: $LOG_DIR/order-service.log"