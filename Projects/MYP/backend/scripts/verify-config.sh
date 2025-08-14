#!/bin/bash

# 验证配置中心和服务配置的脚本

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 配置中心URL
CONFIG_SERVER_URL="http://localhost:8888"

# 等待服务启动的函数
wait_for_service() {
    local service_name=$1
    local url=$2
    local max_retries=30
    local retry=0

    echo -e "${BLUE}等待${service_name}启动在${url}...${NC}"
    while ! curl -s $url > /dev/null 2>&1; do
        if [ $retry -ge $max_retries ]; then
            echo -e "${RED}${service_name}启动超时！${NC}"
            exit 1
        fi
        retry=$((retry + 1))
        sleep 2
    done
    echo -e "${GREEN}${service_name}已启动成功！${NC}"
}

# 验证配置中心是否启动
wait_for_service "配置中心" "${CONFIG_SERVER_URL}/actuator/health"

# 验证配置中心是否能提供配置
echo -e "${YELLOW}\n验证配置中心是否能提供配置...${NC}"

# 验证eureka-server配置
echo -e "${BLUE}验证eureka-server配置...${NC}"
eureka_config=$(curl -s ${CONFIG_SERVER_URL}/eureka-server/default)
if [[ $eureka_config == *"server.port"* && $eureka_config == *"8761"* ]]; then
    echo -e "${GREEN}eureka-server配置验证成功！${NC}"
else
    echo -e "${RED}eureka-server配置验证失败！${NC}"
    echo "响应内容: $eureka_config"
    exit 1
fi

# 验证api-gateway配置
echo -e "${BLUE}验证api-gateway配置...${NC}"
api_gateway_config=$(curl -s ${CONFIG_SERVER_URL}/api-gateway/default)
if [[ $api_gateway_config == *"server.port"* && $api_gateway_config == *"8080"* ]]; then
    echo -e "${GREEN}api-gateway配置验证成功！${NC}"
else
    echo -e "${RED}api-gateway配置验证失败！${NC}"
    echo "响应内容: $api_gateway_config"
    exit 1
fi

# 验证auth-service配置
echo -e "${BLUE}验证auth-service配置...${NC}"
auth_service_config=$(curl -s ${CONFIG_SERVER_URL}/auth-service/default)
if [[ $auth_service_config == *"server.port"* && $auth_service_config == *"8081"* ]]; then
    echo -e "${GREEN}auth-service配置验证成功！${NC}"
else
    echo -e "${RED}auth-service配置验证失败！${NC}"
    echo "响应内容: $auth_service_config"
    exit 1
fi

# 验证tenant-service配置
echo -e "${BLUE}验证tenant-service配置...${NC}"
tenant_service_config=$(curl -s ${CONFIG_SERVER_URL}/tenant-service/default)
if [[ $tenant_service_config == *"server.port"* && $tenant_service_config == *"8082"* ]]; then
    echo -e "${GREEN}tenant-service配置验证成功！${NC}"
else
    echo -e "${RED}tenant-service配置验证失败！${NC}"
    echo "响应内容: $tenant_service_config"
    exit 1
fi

# 验证user-service配置
echo -e "${BLUE}验证user-service配置...${NC}"
user_service_config=$(curl -s ${CONFIG_SERVER_URL}/user-service/default)
if [[ $user_service_config == *"server.port"* && $user_service_config == *"8083"* ]]; then
    echo -e "${GREEN}user-service配置验证成功！${NC}"
else
    echo -e "${RED}user-service配置验证失败！${NC}"
    echo "响应内容: $user_service_config"
    exit 1
fi

# 验证product-service配置
echo -e "${BLUE}验证product-service配置...${NC}"
product_service_config=$(curl -s ${CONFIG_SERVER_URL}/product-service/default)
if [[ $product_service_config == *"server.port"* && $product_service_config == *"8084"* ]]; then
    echo -e "${GREEN}product-service配置验证成功！${NC}"
else
    echo -e "${RED}product-service配置验证失败！${NC}"
    echo "响应内容: $product_service_config"
    exit 1
fi

# 验证order-service配置
echo -e "${BLUE}验证order-service配置...${NC}"
order_service_config=$(curl -s ${CONFIG_SERVER_URL}/order-service/default)
if [[ $order_service_config == *"server.port"* && $order_service_config == *"8085"* ]]; then
    echo -e "${GREEN}order-service配置验证成功！${NC}"
else
    echo -e "${RED}order-service配置验证失败！${NC}"
    echo "响应内容: $order_service_config"
    exit 1
fi

# 所有配置验证成功
 echo -e "${GREEN}\n所有服务配置验证成功！${NC}"
 echo -e "${BLUE}配置中心URL: ${CONFIG_SERVER_URL}${NC}"
 echo -e "${BLUE}可以通过以下URL访问各服务配置:${NC}"
 echo -e "- eureka-server: ${CONFIG_SERVER_URL}/eureka-server/default"
 echo -e "- api-gateway: ${CONFIG_SERVER_URL}/api-gateway/default"
 echo -e "- auth-service: ${CONFIG_SERVER_URL}/auth-service/default"
 echo -e "- tenant-service: ${CONFIG_SERVER_URL}/tenant-service/default"
 echo -e "- user-service: ${CONFIG_SERVER_URL}/user-service/default"
 echo -e "- product-service: ${CONFIG_SERVER_URL}/product-service/default"
 echo -e "- order-service: ${CONFIG_SERVER_URL}/order-service/default"