#!/bin/bash
# 启动前端开发服务器脚本

# 设置项目根目录
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 进入前端目录
cd "$PROJECT_ROOT/src/frontend"

# 安装依赖
npm install

# 启动开发服务器
npm run dev