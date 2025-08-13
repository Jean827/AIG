#!/bin/bash

# 停止auth-service服务的脚本

SERVICE_NAME="auth-service"
echo "正在停止 $SERVICE_NAME..."

# 查找服务进程ID
PID=$(ps -ef | grep $SERVICE_NAME | grep -v grep | awk '{print $2}')
if [ -n "$PID" ]
then
    kill -15 $PID
    echo "已发送终止信号给 $SERVICE_NAME (PID: $PID)"
    # 等待进程终止
    sleep 5
    # 检查进程是否仍在运行
    if ps -p $PID > /dev/null
    then
        echo "$SERVICE_NAME 未正常终止，强制 kill..."
        kill -9 $PID
    else
        echo "$SERVICE_NAME 已成功终止"
    fi
else
    echo "$SERVICE_NAME 未运行"
fi