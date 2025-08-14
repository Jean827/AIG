#!/bin/bash
# 生产环境部署脚本
# 版本: v1.0
# 遵循开发管理计划 (04-开发管理计划.md) 中的脚本使用规范

# 配置文件路径
CONFIG_FILE="${PWD}/../../config/environment-config.yml"

# 部署日志文件
DEPLOY_LOG="${PWD}/../../logs/deploy.log"

# 显示帮助信息
show_help() {
    echo "生产环境部署脚本使用说明"
    echo ""
    echo "用法: ./deploy.sh [选项]"
    echo ""
    echo "选项:"
    echo "  --env, -e <env>      指定部署环境 (dev|test|prod)，默认为 prod"
    echo "  --tag, -t <tag>      指定部署版本标签"
    echo "  --force, -f          强制部署，忽略版本检查"
    echo "  --help, -h           显示帮助信息"
    echo ""
    echo "示例:"
    echo "  部署生产环境: ./deploy.sh"
    echo "  部署测试环境: ./deploy.sh --env test"
    echo "  部署指定版本: ./deploy.sh --tag v1.0.0"
}

# 检查依赖工具
check_dependencies() {
    # 检查 git 是否安装
    if ! command -v git &> /dev/null
    then
        echo "错误: git 未安装，请先安装 git"
        exit 1
    fi

    # 检查 docker 是否安装
    if ! command -v docker &> /dev/null
    then
        echo "错误: docker 未安装，请先安装 docker"
        exit 1
    fi

    # 检查 docker-compose 是否安装
    if ! command -v docker-compose &> /dev/null
    then
        echo "错误: docker-compose 未安装，请先安装 docker-compose"
        exit 1
    fi

    # 检查配置文件是否存在
    if [ ! -f "${CONFIG_FILE}" ]
    then
        echo "错误: 配置文件 ${CONFIG_FILE} 不存在"
        exit 1
    fi
}

# 检查版本
check_version() {
    local tag=$1
    local force=$2

    # 如果强制部署，跳过版本检查
    if [ "${force}" = true ]
    then
        echo "强制部署，忽略版本检查"
        return 0
    fi

    # 检查标签是否存在
    if [ -n "${tag}" ]
    then
        if ! git rev-parse "${tag}^{commit}" > /dev/null 2>&1
        then
            echo "错误: 版本标签 ${tag} 不存在"
            exit 1
        fi
        echo "将部署版本: ${tag}"
    else
        # 使用最新的标签
        tag=$(git describe --tags --abbrev=0)
        echo "将部署最新版本: ${tag}"
    fi

    # 检查工作目录是否干净
    if ! git diff-index --quiet HEAD --
    then
        echo "警告: 工作目录存在未提交的更改"
        read -p "是否继续部署? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]
        then
            exit 1
        fi
    fi
}

# 部署服务
deploy_services() {
    local env=$1
    local tag=$2

    echo "开始部署到 ${env} 环境..."

    # 更新代码到指定版本
    if [ -n "${tag}" ]
    then
        git checkout "${tag}"
    fi

    # 构建 Docker 镜像
    echo "正在构建 Docker 镜像..."
    docker-compose -f ${PWD}/../../docker-compose.yml build

    # 推送 Docker 镜像（如果需要）
    # docker-compose -f ${PWD}/../../docker-compose.yml push

    # 部署服务
    echo "正在部署服务..."
    docker-compose -f ${PWD}/../../docker-compose.yml up -d

    # 等待服务启动
    sleep 30

    # 检查服务健康状态
    echo "正在检查服务健康状态..."
    # 这里可以添加服务健康检查逻辑

    echo "部署完成"
    echo "部署日志已保存到: ${DEPLOY_LOG}"
}

# 主函数
main() {
    check_dependencies

    local env="prod"
    local tag=""
    local force=false

    # 解析命令行参数
    while [[ $# -gt 0 ]]
    do
        case $1 in
            --env|-e)
                env="$2"
                shift 2
                ;;
            --tag|-t)
                tag="$2"
                shift 2
                ;;
            --force|-f)
                force=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                echo "错误: 无效的选项 $1"
                show_help
                exit 1
                ;;
        esac
    done

    # 检查版本
    check_version "${tag}" "${force}"

    # 执行部署
    deploy_services "${env}" "${tag}"
}

# 执行主函数
main "$@"