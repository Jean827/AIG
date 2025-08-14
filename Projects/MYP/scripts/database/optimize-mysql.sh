#!/bin/bash

# MySQL服务器配置优化脚本
# 遵循产品服务数据库设计与优化方案

# 定义变量
MYSQL_CONF_FILE="/etc/my.cnf"  # MySQL配置文件路径
BACKUP_DIR="/Users/Data/AIG/Projects/MYP/backup/mysql"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BENCHMARK_LOG="${BACKUP_DIR}/mysql-benchmark-${TIMESTAMP}.log"

# 创建备份目录
mkdir -p ${BACKUP_DIR}

# 备份当前配置文件
if [ -f ${MYSQL_CONF_FILE} ]; then
    cp ${MYSQL_CONF_FILE} ${BACKUP_DIR}/my.cnf.${TIMESTAMP}
    echo "已备份当前MySQL配置到 ${BACKUP_DIR}/my.cnf.${TIMESTAMP}"
else
    echo "未找到MySQL配置文件: ${MYSQL_CONF_FILE}"
    exit 1
fi

# 执行性能基准测试（优化前）
echo "开始优化前性能基准测试..."
mysql -u root -p -e "SELECT BENCHMARK(1000000, MD5('test'));" >> ${BENCHMARK_LOG}
 echo "优化前基准测试完成，结果保存在 ${BENCHMARK_LOG}"

# 应用优化配置
cat << EOF >> ${MYSQL_CONF_FILE}

# 优化配置 - 添加于 ${TIMESTAMP}
[mysqld]
# InnoDB优化
innodb_buffer_pool_size = 512M
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# 查询缓存优化
query_cache_size = 64M
query_cache_type = 1

# 连接优化
max_connections = 200
wait_timeout = 60
interactive_timeout = 60

# 其他优化
thread_cache_size = 16
table_open_cache = 256
sort_buffer_size = 4M
read_buffer_size = 4M
read_rnd_buffer_size = 8M
join_buffer_size = 4M
EOF

echo "已添加优化配置到 ${MYSQL_CONF_FILE}"

# 重启MySQL服务
echo "重启MySQL服务..."
sudo systemctl restart mysql
if [ $? -eq 0 ]; then
    echo "MySQL服务重启成功"
else
    echo "MySQL服务重启失败，请检查配置文件"
    exit 1
fi

# 等待服务启动
sleep 5

# 执行性能基准测试（优化后）
echo "开始优化后性能基准测试..."
mysql -u root -p -e "SELECT BENCHMARK(1000000, MD5('test'));" >> ${BENCHMARK_LOG}
echo "优化后基准测试完成，结果保存在 ${BENCHMARK_LOG}"

# 显示优化结果比较
echo "\n优化前后性能对比:\n"
cat ${BENCHMARK_LOG}

echo "\nMySQL配置优化完成！"
 echo "建议："
 echo "1. 监控数据库性能，根据实际负载调整参数"
 echo "2. 定期分析慢查询日志，优化查询语句"
 echo "3. 确保索引使用效率"