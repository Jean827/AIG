#!/bin/bash

# 配置管理服务启动脚本

# 设置环境变量
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

# 构建项目
mvn clean package -DskipTests

# 启动服务
java -jar target/config-service-1.0.0.jar