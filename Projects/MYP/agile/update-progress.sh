#!/bin/bash

# 设置要更新的进度报告文件路径
report_file="/Users/Data/AIG/Projects/MYP/agile/PROGRESS-REPORT.md"

# 创建临时文件
temp_file="$report_file.tmp"
> "$temp_file"

echo "正在创建进度报告..."

# 添加项目基本信息标题和内容
echo "## 项目基本信息" >> "$temp_file"
echo "- **项目名称**: MYP微服务项目" >> "$temp_file"

echo "正在添加日期信息..."
# 获取当前日期和时间
current_date=$(date +"%Y-%m-%d")
last_update=$(date +"%Y-%m-%d %H:%M:%S")

echo "- **报告日期**: $current_date" >> "$temp_file"
echo "- **上次更新**: $last_update" >> "$temp_file"
echo "- **项目负责人**: 张经理" >> "$temp_file"
echo "- **整体进度**: 97%  (V1.0版本进度: 95%)" >> "$temp_file"

echo "正在添加空行..."
echo >> "$temp_file"

# 检查原文件是否存在
if [ -f "$report_file" ]; then
    echo "原文件存在，正在提取项目概述及其他内容..."
    # 提取项目概述及之后的内容
    project_overview=$(sed -n '/^## 项目概述/,$p' "$report_file")
    if [ -n "$project_overview" ]; then
        echo "找到项目概述，正在添加..."
        echo "$project_overview" >> "$temp_file"
    else
        echo "未找到项目概述，添加默认内容..."
        echo "## 项目概述" >> "$temp_file"
        echo "本项目是一个基于微服务架构的多租户管理平台，包含租户服务、认证服务、用户服务等核心模块。" >> "$temp_file"
        echo >> "$temp_file"
    fi
else
    echo "原文件不存在，添加默认项目概述..."
    echo "## 项目概述" >> "$temp_file"
    echo "本项目是一个基于微服务架构的多租户管理平台，包含租户服务、认证服务、用户服务等核心模块。" >> "$temp_file"
    echo >> "$temp_file"
fi

# 显示临时文件前10行内容用于调试
echo "临时文件前10行内容:" 
head -10 "$temp_file"

echo "正在替换原文件..."
# 用临时文件替换原文件
mv -f "$temp_file" "$report_file"

echo "正在更新迭代3进度..."
# 更新进行中工作进度
sed -i '' "s/前端界面原型开发 - 70% 完成/前端界面原型开发 - 85% 完成/g" "$report_file"
sed -i '' "s/产品服务开发 - 80% 完成/产品服务开发 - 90% 完成/g" "$report_file"
# 更新迭代3进度
sed -i '' "s/迭代3: 认证授权功能开发 - 75% 完成/迭代3: 认证授权功能开发 - 85% 完成/g" "$report_file"
# 更新服务间通信进度
sed -i '' "s/实现服务间通信 - 95% 完成/实现服务间通信 - 100% 完成/g" "$report_file"

echo "进度报告已更新成功！"
# 显示更新后的报告文件前10行
echo "更新后的报告文件前10行内容:" 
head -10 "$report_file"