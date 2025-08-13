#!/bin/bash

# 停止所有服务的脚本

# 定义服务名称列表
SERVICES=("eureka-server" "api-gateway" "product-service" "order-service" "auth-service" "tenant-service" "user-service")

# 停止每个服务
for SERVICE in "${SERVICES[@]}"
do
    echo "正在停止 $SERVICE..."
    # 查找服务进程ID
    PID=$(ps -ef | grep $SERVICE | grep -v grep | awk '{print $2}')
    if [ -n "$PID" ]
    then
        kill -15 $PID
        echo "已发送终止信号给 $SERVICE (PID: $PID)"
        # 等待进程终止
        sleep 5
        # 检查进程是否仍在运行
        if ps -p $PID > /dev/null
        then
            echo "$SERVICE 未正常终止，强制 kill..."
            kill -9 $PID
        else
            echo "$SERVICE 已成功终止"
        fi
    else
        echo "$SERVICE 未运行"
    fi
done

echo "所有服务停止完成！"