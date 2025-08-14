#!/bin/bash

# 启动Eureka服务器集群

# 构建eureka-server项目
cd /Users/Data/AIG/Projects/MYP/backend/eureka-server
mvn clean package -DskipTests

# 启动第一个Eureka节点
java -jar target/eureka-server-0.0.1-SNAPSHOT.jar --spring.profiles.active=server1 &
SERVER1_PID=$!
echo "Eureka Server1 started with PID: $SERVER1_PID"

# 等待3秒，确保第一个节点已启动
sleep 3

# 启动第二个Eureka节点
java -jar target/eureka-server-0.0.1-SNAPSHOT.jar --spring.profiles.active=server2 &
SERVER2_PID=$!
echo "Eureka Server2 started with PID: $SERVER2_PID"

# 等待5秒，确保Eureka集群已稳定
sleep 5

# 启动配置服务
cd /Users/Data/AIG/Projects/MYP/backend/config-service
mvn clean package -DskipTests
java -jar target/config-service-0.0.1-SNAPSHOT.jar &
CONFIG_PID=$!
echo "Config Service started with PID: $CONFIG_PID"

# 等待服务启动
wait