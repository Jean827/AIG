#!/bin/bash
# 测试运行脚本
# 版本: v1.0
# 遵循开发管理计划 (04-开发管理计划.md) 中的脚本使用规范

# 配置文件路径
CONFIG_FILE="${PWD}/../../config/environment-config.yml"

# 测试日志文件
TEST_LOG="${PWD}/../../logs/test.log"

# 显示帮助信息
show_help() {
    echo "测试运行脚本使用说明"
    echo ""
    echo "用法: ./run-tests.sh [选项]"
    echo ""
    echo "选项:"
    echo "  --unit, -u           只运行单元测试"
    echo "  --integration, -i    只运行集成测试"
    echo "  --all, -a            运行所有测试 (默认)"
    echo "  --coverage, -c       生成测试覆盖率报告"
    echo "  --help, -h           显示帮助信息"
    echo ""
    echo "示例:"
    echo "  运行所有测试: ./run-tests.sh"
    echo "  只运行单元测试: ./run-tests.sh --unit"
    echo "  运行所有测试并生成覆盖率报告: ./run-tests.sh --all --coverage"
}

# 检查依赖工具
check_dependencies() {
    # 检查 Java 是否安装
    if ! command -v java &> /dev/null
    then
        echo "错误: Java 未安装，请先安装 Java"
        exit 1
    fi

    # 检查 Maven 是否安装
    if ! command -v mvn &> /dev/null
    then
        echo "错误: Maven 未安装，请先安装 Maven"
        exit 1
    fi

    # 检查配置文件是否存在
    if [ ! -f "${CONFIG_FILE}" ]
    then
        echo "警告: 配置文件 ${CONFIG_FILE} 不存在，将使用默认配置"
    fi
}

# 运行单元测试
run_unit_tests() {
    echo "正在运行单元测试..."

    # 进入后端目录
    cd ${PWD}/../../backend

    # 运行单元测试
    mvn test -Dtest="*UnitTest" > ${TEST_LOG} 2>&1

    # 检查测试结果
    if grep -q "BUILD SUCCESS" ${TEST_LOG}
    then
        echo "单元测试运行成功"
    else
        echo "错误: 单元测试运行失败，请查看日志: ${TEST_LOG}"
        exit 1
    fi

    cd -
}

# 运行集成测试
run_integration_tests() {
    echo "正在运行集成测试..."

    # 进入后端目录
    cd ${PWD}/../../backend

    # 运行集成测试
    mvn test -Dtest="*IntegrationTest" > ${TEST_LOG} 2>&1

    # 检查测试结果
    if grep -q "BUILD SUCCESS" ${TEST_LOG}
    then
        echo "集成测试运行成功"
    else
        echo "错误: 集成测试运行失败，请查看日志: ${TEST_LOG}"
        exit 1
    fi

    cd -
}

# 生成测试覆盖率报告
generate_coverage_report() {
    echo "正在生成测试覆盖率报告..."

    # 进入后端目录
    cd ${PWD}/../../backend

    # 运行测试并生成覆盖率报告
    mvn jacoco:prepare-agent test jacoco:report > ${TEST_LOG} 2>&1

    # 检查报告是否生成成功
    if [ -f "${PWD}/target/site/jacoco/index.html" ]
    then
        echo "测试覆盖率报告生成成功: ${PWD}/target/site/jacoco/index.html"
    else
        echo "错误: 测试覆盖率报告生成失败，请查看日志: ${TEST_LOG}"
        exit 1
    fi

    cd -
}

# 主函数
main() {
    check_dependencies

    local run_unit=true
    local run_integration=true
    local generate_coverage=false

    # 默认只运行所有测试
    if [[ $# -eq 0 ]]
    then
        run_unit=true
        run_integration=true
    fi

    # 解析命令行参数
    while [[ $# -gt 0 ]]
    do
        case $1 in
            --unit|-u)
                run_unit=true
                run_integration=false
                shift
                ;;
            --integration|-i)
                run_unit=false
                run_integration=true
                shift
                ;;
            --all|-a)
                run_unit=true
                run_integration=true
                shift
                ;;
            --coverage|-c)
                generate_coverage=true
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

    # 执行测试
    if [ "${run_unit}" = true ]
    then
        run_unit_tests
    fi

    if [ "${run_integration}" = true ]
    then
        run_integration_tests
    fi

    # 生成覆盖率报告
    if [ "${generate_coverage}" = true ]
    then
        generate_coverage_report
    fi

    echo "测试执行完成"
    echo "测试日志已保存到: ${TEST_LOG}"
}

# 执行主函数
main "$@"