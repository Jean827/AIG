#!/bin/bash
# AKS项目启动脚本
# 用于启动后端和前端服务

# 设置项目根目录
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 创建日志目录
mkdir -p "$PROJECT_ROOT/logs"

# 检查Python环境
check_python() {
    echo "检查Python环境..."
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version 2>&1)
        echo "Python版本: $PYTHON_VERSION"
        return 0
    else
        echo "错误: 未找到Python3环境。请先安装Python3。" >&2
        return 1
    fi
}

# 检查Node.js环境
check_node() {
    echo "检查Node.js环境..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo "Node.js版本: $NODE_VERSION"
        return 0
    else
        echo "警告: 未找到Node.js环境。前端服务将无法启动。" >&2
        return 1
    fi
}

# 初始化Python虚拟环境和安装后端依赖
setup_backend() {
    echo "设置后端环境..."
    
    # 创建虚拟环境
    if [ ! -d "$PROJECT_ROOT/.venv" ]; then
        echo "创建Python虚拟环境..."
        python3 -m venv "$PROJECT_ROOT/.venv"
        if [ $? -ne 0 ]; then
            echo "错误: 创建虚拟环境失败。" >&2
            return 1
        fi
    fi
    
    # 激活虚拟环境
    source "$PROJECT_ROOT/.venv/bin/activate"
    if [ $? -ne 0 ]; then
        echo "错误: 激活虚拟环境失败。" >&2
        return 1
    fi
    
    # 安装依赖
    echo "安装后端依赖..."
    pip install --upgrade pip
    pip install -r "$PROJECT_ROOT/requirements.txt"
    if [ $? -ne 0 ]; then
        echo "错误: 安装后端依赖失败。" >&2
        return 1
    fi
    
    # 初始化数据库
    echo "初始化数据库..."
    python3 "$PROJECT_ROOT/init_database.py"
    
    # 后端环境设置成功
    return 0
}

# 启动后端服务
start_backend() {
    echo "启动后端服务..."
    
    # 激活虚拟环境
    source "$PROJECT_ROOT/.venv/bin/activate"
    
    # 设置Python路径
    export PYTHONPATH="$PROJECT_ROOT/src/backend:$PYTHONPATH"
    
    # 启动后端服务
    cd "$PROJECT_ROOT/src/backend"
    python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > "$PROJECT_ROOT/logs/backend.log" 2>&1 &
    
    # 记录PID
    BACKEND_PID=$!
    echo $BACKEND_PID > "$PROJECT_ROOT/logs/backend.pid"
    
    echo "后端服务已启动 (PID: $BACKEND_PID)"
    echo "后端日志: logs/backend.log"
}

# 安装前端依赖
setup_frontend() {
    if ! check_node; then
        return 1
    fi
    
    echo "设置前端环境..."
    cd "$PROJECT_ROOT/src/frontend"
    
    # 安装前端依赖
    echo "安装前端依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "错误: 安装前端依赖失败。" >&2
        return 1
    fi
    
    # 前端环境设置成功
    return 0
}

# 启动前端服务
start_frontend() {
    if ! check_node; then
        return 1
    fi
    
    echo "启动前端服务..."
    cd "$PROJECT_ROOT/src/frontend"
    
    # 启动前端服务
    npm run dev > "$PROJECT_ROOT/logs/frontend.log" 2>&1 &
    
    # 记录PID
    FRONTEND_PID=$!
    echo $FRONTEND_PID > "$PROJECT_ROOT/logs/frontend.pid"
    
    echo "前端服务已启动 (PID: $FRONTEND_PID)"
    echo "前端日志: logs/frontend.log"
}

# 停止所有服务
stop_services() {
    echo "停止所有服务..."
    
    # 停止后端服务
    if [ -f "$PROJECT_ROOT/logs/backend.pid" ]; then
        BACKEND_PID=$(cat "$PROJECT_ROOT/logs/backend.pid")
        if ps -p $BACKEND_PID > /dev/null; then
            kill $BACKEND_PID
            echo "后端服务已停止"
        fi
        rm -f "$PROJECT_ROOT/logs/backend.pid"
    fi
    
    # 停止前端服务
    if [ -f "$PROJECT_ROOT/logs/frontend.pid" ]; then
        FRONTEND_PID=$(cat "$PROJECT_ROOT/logs/frontend.pid")
        if ps -p $FRONTEND_PID > /dev/null; then
            kill $FRONTEND_PID
            echo "前端服务已停止"
        fi
        rm -f "$PROJECT_ROOT/logs/frontend.pid"
    fi
}

# 显示帮助信息
show_help() {
    echo "AKS项目启动脚本"
    echo "用法: $0 [命令]"
    echo ""
    echo "命令列表:"
    echo "  start        启动后端和前端服务"
    echo "  backend      仅启动后端服务"
    echo "  frontend     仅启动前端服务"
    echo "  setup        设置后端和前端环境"
    echo "  setup-backend 设置后端环境"
    echo "  setup-frontend 设置前端环境"
    echo "  stop         停止所有服务"
    echo "  help         显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 start      # 启动所有服务"
    echo "  $0 setup      # 设置所有环境"
}

# 主函数
main() {
    # 处理命令行参数
    case "$1" in
        start)
            check_python || exit 1
            setup_backend || exit 1
            start_backend
            check_node && setup_frontend && start_frontend
            echo "\n服务启动完成！"
            echo "后端服务访问地址: http://localhost:8000"
            echo "前端服务访问地址: http://localhost:5173 (默认)"
            echo "\n使用 '$0 stop' 停止所有服务"
            ;;
        backend)
            check_python || exit 1
            setup_backend || exit 1
            start_backend
            echo "\n后端服务启动完成！"
            echo "后端服务访问地址: http://localhost:8000"
            ;;
        frontend)
            check_node || exit 1
            setup_frontend || exit 1
            start_frontend
            echo "\n前端服务启动完成！"
            echo "前端服务访问地址: http://localhost:5173 (默认)"
            ;;
        setup)
            check_python || exit 1
            setup_backend || exit 1
            check_node && setup_frontend
            echo "\n环境设置完成！"
            ;;
        setup-backend)
            check_python || exit 1
            setup_backend || exit 1
            echo "\n后端环境设置完成！"
            ;;
        setup-frontend)
            check_node || exit 1
            setup_frontend || exit 1
            echo "\n前端环境设置完成！"
            ;;
        stop)
            stop_services
            echo "\n所有服务已停止！"
            ;;
        help | *)
            show_help
            ;;
    esac
}

# 执行主函数
main "$@"