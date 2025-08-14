#!/bin/bash
# 配置解析工具脚本
# 版本: v1.0
# 遵循开发管理计划 (04-开发管理计划.md) 中的脚本使用规范

# 默认配置文件路径
DEFAULT_CONFIG_FILE="${PWD}/../../config/environment-config.yml"

# 显示帮助信息
show_help() {
    echo "配置解析工具脚本使用说明"
    echo ""
    echo "用法: ./config-parser.sh [选项]"
    echo ""
    echo "选项:" 
    echo "  --config, -c <file>  指定配置文件路径 (默认: ${DEFAULT_CONFIG_FILE})"
    echo "  --get, -g <path>     获取指定路径的配置值"
    echo "  --list, -l           列出所有配置项"
    echo "  --help, -h           显示帮助信息"
    echo ""
    echo "示例:"
    echo "  获取后端服务端口: ./config-parser.sh --get backend.port"
    echo "  使用自定义配置文件: ./config-parser.sh --config /path/to/config.yml --get frontend.port"
    echo "  列出所有配置项: ./config-parser.sh --list"
}

# 检查依赖工具
check_dependencies() {
    # 检查 yq 工具是否安装
    if ! command -v yq &> /dev/null
    then
        echo "错误: yq 工具未安装，请先安装 yq"
        echo "安装方法: brew install yq 或参考 https://github.com/mikefarah/yq"
        exit 1
    fi
}

# 解析配置文件
parse_config() {
    local config_file=$1
    local config_path=$2

    # 检查配置文件是否存在
    if [ ! -f "${config_file}" ]
    then
        echo "错误: 配置文件 ${config_file} 不存在"
        exit 1
    fi

    # 获取配置值
    if [ -n "${config_path}" ]
    then
        local value=$(yq eval ".${config_path}" "${config_file}")
        echo "${value}"
    else
        # 列出所有配置项
        yq eval "." "${config_file}"
    fi
}

# 主函数
main() {
    check_dependencies

    local config_file="${DEFAULT_CONFIG_FILE}"
    local config_path=""
    local list_mode=false

    # 解析命令行参数
    while [[ $# -gt 0 ]]
    do
        case $1 in
            --config|-c)
                config_file="$2"
                shift 2
                ;;
            --get|-g)
                config_path="$2"
                shift 2
                ;;
            --list|-l)
                list_mode=true
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

    # 执行配置解析
    if [ "${list_mode}" = true ]
    then
        parse_config "${config_file}" ""
    elif [ -n "${config_path}" ]
    then
        parse_config "${config_file}" "${config_path}"
    else
        echo "错误: 请指定要获取的配置路径或使用 --list 选项"
        show_help
        exit 1
    fi
}

# 执行主函数
main "$@"