#!/bin/bash
# 启动后端服务脚本

# 设置项目根目录
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 设置Python路径
export PYTHONPATH="$PROJECT_ROOT/src/backend:$PYTHONPATH"

# 检查是否有虚拟环境，如果没有则创建
if [ ! -d "$PROJECT_ROOT/.venv" ]; then
    echo "创建Python虚拟环境..."
    python3 -m venv "$PROJECT_ROOT/.venv"
fi

# 激活虚拟环境
source "$PROJECT_ROOT/.venv/bin/activate"

# 安装依赖
pip install --upgrade pip
pip install -r "$PROJECT_ROOT/requirements.txt"

# 启动后端服务
cd "$PROJECT_ROOT/src/backend"
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload