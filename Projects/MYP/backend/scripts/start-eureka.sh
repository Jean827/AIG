#!/bin/bash

# 启动eureka-server服务的脚本

# 日志目录
LOG_DIR="/Users/Data/AIG/Projects/MYP/backend/logs"
mkdir -p $LOG_DIR

# 启动eureka-server
cd /Users/Data/AIG/Projects/MYP/backend/eureka-server
nohup mvn spring-boot:run > $LOG_DIR/eureka-server.log 2>&1 &
echo "eureka-server 已启动，日志文件: $LOG_DIR/eureka-server.log"