#!/bin/bash

# 项目进度报告自动更新脚本

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 报告文件路径
REPORT_FILE="/Users/Data/AIG/Projects/MYP/agile/PROGRESS-REPORT.md"

# 检查报告文件是否存在
if [ ! -f "$REPORT_FILE" ]; then
    echo -e "${RED}错误: 找不到进度报告文件 $REPORT_FILE${NC}"
    exit 1
fi

# 更新报告日期
report_date=$(date +"%Y-%m-%d")
sed -i '' "s/{{report_date}}/$report_date/g" "$REPORT_FILE"
echo -e "${GREEN}已更新报告日期为: $report_date${NC}"

# 更新项目负责人 (可从环境变量或配置文件中获取)
project_manager="张经理"
sed -i '' "s/{{project_manager}}/$project_manager/g" "$REPORT_FILE"
echo -e "${GREEN}已更新项目负责人为: $project_manager${NC}"

# 更新整体进度 (示例: 这里使用固定值，实际应用中可从项目管理工具API获取)
overall_progress=40
sed -i '' "s/{{overall_progress}}/$overall_progress/g" "$REPORT_FILE"
echo -e "${GREEN}已更新整体进度为: $overall_progress%${NC}"

# 更新项目概述
project_overview="本项目是一个基于微服务架构的电商平台，包含用户服务、产品服务、订单服务等核心模块。目前已完成配置中心的搭建和基础服务的配置工作。"
sed -i '' "s/{{project_overview}}/$project_overview/g" "$REPORT_FILE"
echo -e "${GREEN}已更新项目概述${NC}"

# 更新其他已完成工作
completed_other="暂无其他已完成工作"
sed -i '' "s/{{completed_other}}/$completed_other/g" "$REPORT_FILE"
echo -e "${GREEN}已更新其他已完成工作${NC}"

# 更新进行中工作
in_progress_work="1. 用户服务API开发\n2. 产品服务数据库设计\n3. 前端界面原型开发"
sed -i '' "s/{{in_progress_work}}/$in_progress_work/g" "$REPORT_FILE"
echo -e "${GREEN}已更新进行中工作${NC}"

# 更新计划工作
planned_work="1. 完成API网关配置\n2. 实现服务间通信\n3. 开发认证授权功能"
sed -i '' "s/{{planned_work}}/$planned_work/g" "$REPORT_FILE"
echo -e "${GREEN}已更新计划工作${NC}"

# 更新问题与风险
issues_and_risks="1. 配置中心高可用方案尚未确定\n2. 部分服务依赖的第三方库版本冲突"
sed -i '' "s/{{issues_and_risks}}/$issues_and_risks/g" "$REPORT_FILE"
echo -e "${GREEN}已更新问题与风险${NC}"

# 更新资源使用情况
resource_usage="1. 开发人员: 5人\n2. 测试人员: 2人\n3. 服务器资源: 8核16G"
sed -i '' "s/{{resource_usage}}/$resource_usage/g" "$REPORT_FILE"
echo -e "${GREEN}已更新资源使用情况${NC}"

# 更新下一步计划
next_steps="1. 完成配置中心高可用部署\n2. 实现服务熔断和限流功能\n3. 开始集成测试"
sed -i '' "s/{{next_steps}}/$next_steps/g" "$REPORT_FILE"
echo -e "${GREEN}已更新下一步计划${NC}"

# 提示完成
 echo -e "${BLUE}\n项目进度报告已成功更新!${NC}"
 echo -e "${BLUE}报告路径: $REPORT_FILE${NC}"