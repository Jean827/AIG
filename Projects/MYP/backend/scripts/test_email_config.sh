#!/bin/bash

# 这是一个测试邮件服务器配置的脚本

# 定义颜色常量
green='\033[0;32m'
red='\033[0;31m'
NC='\033[0m' # 无颜色

# 输出提示信息
echo -e "${green}开始测试邮件服务器配置...${NC}"

# 切换到auth-service目录
cd /Users/Data/AIG/Projects/MYP/backend/auth-service

# 运行邮件配置测试
echo -e "${green}正在运行邮件配置测试，向Jean.xu@muyacorp.com发送测试邮件...${NC}"
mvn test -Dtest=EmailConfigurationTest

# 检查测试结果
if [ $? -eq 0 ]; then
  echo -e "${green}邮件配置测试成功！请检查Jean.xu@muyacorp.com邮箱是否收到测试邮件。${NC}"
else
  echo -e "${red}邮件配置测试失败！请检查邮件服务器配置是否正确。${NC}"
fi

echo -e "${green}测试完成。${NC}"