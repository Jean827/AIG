#!/bin/bash

# 启动product-service服务的脚本

# 日志目录
LOG_DIR="/Users/Data/AIG/Projects/MYP/backend/logs"
mkdir -p $LOG_DIR

# 启动product-service
cd /Users/Data/AIG/Projects/MYP/backend/product-service
nohup mvn spring-boot:run > $LOG_DIR/product-service.log 2>&1 &
echo "product-service 已启动，日志文件: $LOG_DIR/product-service.log"