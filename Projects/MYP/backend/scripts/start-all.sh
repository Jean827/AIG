#!/bin/bash

# 启动所有服务的脚本

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 日志目录
LOG_DIR="/Users/Data/AIG/Projects/MYP/backend/logs"
mkdir -p $LOG_DIR

# 等待服务启动的函数
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_retries=30
    local retry=0

    echo -e "${BLUE}等待${service_name}启动在端口${port}...${NC}"
    while ! nc -z localhost $port > /dev/null 2>&1; do
        if [ $retry -ge $max_retries ]; then
            echo -e "${RED}${service_name}启动超时！${NC}"
            exit 1
        fi
        retry=$((retry + 1))
        sleep 2
    done
    echo -e "${GREEN}${service_name}已启动成功！${NC}"
}

# 启动顺序：配置中心 -> 服务注册中心 -> API网关 -> 其他微服务

# 启动配置中心
cd /Users/Data/AIG/Projects/MYP/backend/config-service
nohup mvn spring-boot:run > $LOG_DIR/config-service.log 2>&1 &
echo -e "${YELLOW}配置中心已启动，日志文件: $LOG_DIR/config-service.log${NC}"
wait_for_service "配置中心" 8888

# 启动服务注册中心
cd /Users/Data/AIG/Projects/MYP/backend/eureka-server
cd /Users/Data/AIG/Projects/MYP/backend/eureka-server
nohup mvn spring-boot:run > $LOG_DIR/eureka-server.log 2>&1 &
echo "eureka-server 已启动，日志文件: $LOG_DIR/eureka-server.log"

nohup mvn spring-boot:run > $LOG_DIR/eureka-server.log 2>&1 &
echo -e "${YELLOW}服务注册中心已启动，日志文件: $LOG_DIR/eureka-server.log${NC}"
wait_for_service "服务注册中心" 8761

cd /Users/Data/AIG/Projects/MYP/backend/api-gateway
nohup mvn spring-boot:run > $LOG_DIR/api-gateway.log 2>&1 &
echo -e "${YELLOW}API网关已启动，日志文件: $LOG_DIR/api-gateway.log${NC}"
wait_for_service "API网关" 8080

cd /Users/Data/AIG/Projects/MYP/backend/auth-service
nohup mvn spring-boot:run > $LOG_DIR/auth-service.log 2>&1 &
echo -e "${YELLOW}认证服务已启动，日志文件: $LOG_DIR/auth-service.log${NC}"
wait_for_service "认证服务" 8081

cd /Users/Data/AIG/Projects/MYP/backend/tenant-service
nohup mvn spring-boot:run > $LOG_DIR/tenant-service.log 2>&1 &
echo -e "${YELLOW}租户服务已启动，日志文件: $LOG_DIR/tenant-service.log${NC}"
wait_for_service "租户服务" 8082

cd /Users/Data/AIG/Projects/MYP/backend/user-service
nohup mvn spring-boot:run > $LOG_DIR/user-service.log 2>&1 &
echo -e "${YELLOW}用户服务已启动，日志文件: $LOG_DIR/user-service.log${NC}"
wait_for_service "用户服务" 8083

cd /Users/Data/AIG/Projects/MYP/backend/product-service
nohup mvn spring-boot:run > $LOG_DIR/product-service.log 2>&1 &
echo -e "${YELLOW}产品服务已启动，日志文件: $LOG_DIR/product-service.log${NC}"
wait_for_service "产品服务" 8084

cd /Users/Data/AIG/Projects/MYP/backend/order-service
nohup mvn spring-boot:run > $LOG_DIR/order-service.log 2>&1 &
echo -e "${YELLOW}订单服务已启动，日志文件: $LOG_DIR/order-service.log${NC}"
wait_for_service "订单服务" 8085

# 返回scripts目录
cd /Users/Data/AIG/Projects/MYP/backend/scripts

echo -e "${GREEN}所有服务已启动成功！${NC}"
echo -e "${BLUE}服务列表:${NC}"
echo -e "- 配置中心: http://localhost:8888"
echo -e "- 服务注册中心: http://localhost:8761"
echo -e "- API网关: http://localhost:8080"
echo -e "- 认证服务: http://localhost:8081"
echo -e "- 租户服务: http://localhost:8082"
echo -e "- 用户服务: http://localhost:8083"
echo -e "- 产品服务: http://localhost:8084"
echo -e "- 订单服务: http://localhost:8085"