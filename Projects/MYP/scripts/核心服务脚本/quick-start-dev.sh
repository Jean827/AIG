#!/bin/bash

# 快速启动开发环境脚本
# 版本: v1.0
# 遵循开发管理计划 (04-开发管理计划.md) 中的脚本使用规范

# 配置文件路径
CONFIG_FILE="${PWD}/config/environment-config.yml"

# 服务端口配置
BACKEND_PORT=8080
FRONTEND_PORT=3000
DATABASE_PORT=3306

# 服务日志文件
BACKEND_LOG="${PWD}/logs/backend.log"
FRONTEND_LOG="${PWD}/logs/frontend.log"
DATABASE_LOG="${PWD}/logs/database.log"

# 脚本使用说明
show_help() {
    echo "快速启动开发环境脚本使用说明"
    echo ""
    echo "用法: ./quick-start-dev.sh [选项]"
    echo ""
    echo "选项:"
    echo "  --status, -s       查看所有服务状态"
    echo "  --logs, -l         查看服务日志"
    echo "  --kill, -k         停止所有服务"
    echo "  --restart, -r      重启所有服务"
    echo "  --help, -h         显示帮助信息"
    echo ""
    echo "示例:"
    echo "  启动开发环境: ./quick-start-dev.sh"
    echo "  查看服务状态: ./quick-start-dev.sh --status"
    echo "  查看服务日志: ./quick-start-dev.sh --logs"
    echo "  停止所有服务: ./quick-start-dev.sh --kill"
    echo "  重启所有服务: ./quick-start-dev.sh --restart"
}

# 环境检查
check_environment() {
    echo "正在进行环境检查..."

    # 检查 Java 是否安装
    if ! command -v java &> /dev/null
    then
        echo "错误: Java 未安装，请先安装 Java 17 或更高版本"
        exit 1
    fi

    # 检查 Node.js 是否安装
    if ! command -v node &> /dev/null
    then
        echo "错误: Node.js 未安装，请先安装 Node.js 16 或更高版本"
        exit 1
    fi

    # 检查 npm 是否安装
    if ! command -v npm &> /dev/null
    then
        echo "错误: npm 未安装，请先安装 npm"
        exit 1
    fi

    # 检查 Docker 是否安装
    if ! command -v docker &> /dev/null
    then
        echo "错误: Docker 未安装，请先安装 Docker"
        exit 1
    fi

    # 检查配置文件是否存在
    if [ ! -f "${CONFIG_FILE}" ]
    then
        echo "警告: 配置文件 ${CONFIG_FILE} 不存在，将使用默认配置"
    fi

    # 创建日志目录
    mkdir -p "${PWD}/logs"

    echo "环境检查完成"
}

# 端口检查和释放
check_and_release_port() {
    local port=$1
    local service=$2

    echo "检查 ${service} 端口 ${port}..."

    # 检查端口是否被占用
    if lsof -i :${port} &> /dev/null
    then
        echo "警告: ${service} 端口 ${port} 已被占用，尝试释放..."
        # 杀死占用端口的进程
        kill -9 $(lsof -t -i :${port})
        echo "${service} 端口 ${port} 已释放"
    else
        echo "${service} 端口 ${port} 可用"
    fi
}

# 启动后端服务
start_backend() {
    echo "正在启动后端服务..."

    # 检查和释放端口
    check_and_release_port ${BACKEND_PORT} "后端服务"

    # 启动后端服务 (假设使用 Spring Boot)
    cd ${PWD}/backend
    nohup ./mvnw spring-boot:run > ${BACKEND_LOG} 2>&1 &
    BACKEND_PID=$!
    echo "后端服务已启动，PID: ${BACKEND_PID}"

    # 等待服务启动
    sleep 10

    # 检查服务是否启动成功
    if ! curl -s http://localhost:${BACKEND_PORT}/actuator/health | grep -q "UP"
    then
        echo "警告: 后端服务启动可能未成功，请查看日志: ${BACKEND_LOG}"
    else
        echo "后端服务启动成功"
    fi

    cd -
}

# 启动前端服务
start_frontend() {
    echo "正在启动前端服务..."

    # 检查和释放端口
    check_and_release_port ${FRONTEND_PORT} "前端服务"

    # 启动前端服务 (假设使用 React)
    cd ${PWD}/frontend
    nohup npm start > ${FRONTEND_LOG} 2>&1 &
    FRONTEND_PID=$!
    echo "前端服务已启动，PID: ${FRONTEND_PID}"

    # 等待服务启动
    sleep 5

    # 检查服务是否启动成功
    if ! curl -s http://localhost:${FRONTEND_PORT} | grep -q "<title>"
    then
        echo "警告: 前端服务启动可能未成功，请查看日志: ${FRONTEND_LOG}"
    else
        echo "前端服务启动成功"
    fi

    cd -
}

# 启动数据库服务
start_database() {
    echo "正在启动数据库服务..."

    # 检查和释放端口
    check_and_release_port ${DATABASE_PORT} "数据库服务"

    # 启动数据库服务 (假设使用 Docker)
    docker-compose -f ${PWD}/docker-compose.yml up -d database
    echo "数据库服务已启动"

    # 等待服务启动
    sleep 10

    # 检查服务是否启动成功
    if ! docker ps | grep -q "database"
    then
        echo "警告: 数据库服务启动可能未成功，请查看 Docker 日志"
    else
        echo "数据库服务启动成功"
    fi
}

# 启动所有服务
start_all_services() {
    echo "开始启动所有服务..."

    # 启动数据库服务
    start_database

    # 启动后端服务
    start_backend

    # 启动前端服务
    start_frontend

    echo "所有服务启动完成"
    echo ""
    echo "服务访问地址:"
    echo "- 后端服务: http://localhost:${BACKEND_PORT}"
    echo "- 前端服务: http://localhost:${FRONTEND_PORT}"
    echo "- 数据库服务: localhost:${DATABASE_PORT}"
}

# 查看服务状态
check_service_status() {
    echo "正在查看服务状态..."

    # 检查后端服务状态
    if lsof -i :${BACKEND_PORT} &> /dev/null
    then
        echo "后端服务: 运行中 (端口: ${BACKEND_PORT})"
    else
        echo "后端服务: 未运行"
    fi

    # 检查前端服务状态
    if lsof -i :${FRONTEND_PORT} &> /dev/null
    then
        echo "前端服务: 运行中 (端口: ${FRONTEND_PORT})"
    else
        echo "前端服务: 未运行"
    fi

    # 检查数据库服务状态
    if docker ps | grep -q "database"
    then
        echo "数据库服务: 运行中 (端口: ${DATABASE_PORT})"
    else
        echo "数据库服务: 未运行"
    fi
}

# 查看服务日志
view_service_logs() {
    echo "查看服务日志..."
    echo "1. 后端服务日志"
    echo "2. 前端服务日志"
    echo "3. 数据库服务日志"
    echo "4. 查看所有日志"
    echo "请选择要查看的日志类型 (1-4):"
    read choice

    case $choice in
        1)
            echo "查看后端服务日志 (${BACKEND_LOG})..."
            tail -f ${BACKEND_LOG}
            ;;
        2)
            echo "查看前端服务日志 (${FRONTEND_LOG})..."
            tail -f ${FRONTEND_LOG}
            ;;
        3)
            echo "查看数据库服务日志..."
            docker logs -f database
            ;;
        4)
            echo "同时查看所有服务日志..."
            echo "按 Ctrl+C 退出查看"
            tail -f ${BACKEND_LOG} ${FRONTEND_LOG} &
            docker logs -f database
            ;;
        *)
            echo "无效选择，请重试"
            view_service_logs
            ;;
    esac
}

# 停止所有服务
stop_all_services() {
    echo "正在停止所有服务..."

    # 停止后端服务
    if lsof -i :${BACKEND_PORT} &> /dev/null
    then
        echo "停止后端服务..."
        kill -9 $(lsof -t -i :${BACKEND_PORT})
        echo "后端服务已停止"
    else
        echo "后端服务未运行"
    fi

    # 停止前端服务
    if lsof -i :${FRONTEND_PORT} &> /dev/null
    then
        echo "停止前端服务..."
        kill -9 $(lsof -t -i :${FRONTEND_PORT})
        echo "前端服务已停止"
    else
        echo "前端服务未运行"
    fi

    # 停止数据库服务
    if docker ps | grep -q "database"
    then
        echo "停止数据库服务..."
        docker-compose -f ${PWD}/docker-compose.yml down database
        echo "数据库服务已停止"
    else
        echo "数据库服务未运行"
    fi

    echo "所有服务已停止"
}

# 主函数
main() {
    # 检查参数
    case $1 in
        --status|-s)
            check_service_status
            ;;
        --logs|-l)
            view_service_logs
            ;;
        --kill|-k)
            stop_all_services
            ;;
        --restart|-r)
            stop_all_services
            echo ""
            check_environment
            echo ""
            start_all_services
            ;;
        --help|-h)
            show_help
            ;;
        *)
            # 执行默认操作: 启动开发环境
            check_environment
            echo ""
            start_all_services
            ;;
    esac
}

# 执行主函数
main "$@"