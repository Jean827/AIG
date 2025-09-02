#!/bin/bash

# 订单服务启动脚本

# 设置环境变量
export SPRING_PROFILES_ACTIVE=dev

# 打印启动信息
echo "正在启动订单服务..."
# 检查是否已有相同端口的服务在运行
PORT=8085
PID=$(lsof -t -i:$PORT)
if [ -n "$PID" ]; then
  echo "端口 $PORT 已被占用，进程ID: $PID"
  echo "正在终止该进程..."
  kill -9 $PID
  if [ $? -eq 0 ]; then
    echo "进程 $PID 已终止"
  else
    echo "终止进程 $PID 失败"
    exit 1
  fi
fi

# 启动服务
cd $(dirname $0)
mvn spring-boot:run

# 检查启动是否成功
if [ $? -eq 0 ]; then
  echo "订单服务启动成功!"
  echo "服务地址: http://localhost:$PORT"
else
  echo "订单服务启动失败!"
  exit 1
fi