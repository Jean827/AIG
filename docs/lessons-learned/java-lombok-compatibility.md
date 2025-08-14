# 技术经验总结

## 基本信息
- **总结时间**: 2025-08-12 15:30:00 CST
- **总结人员**: 技术团队
- **技术领域**: Java开发、构建工具
- **项目阶段**: 认证授权服务开发阶段(70%)

## 经验描述
### 背景
在认证授权服务(auth-service)开发过程中，遇到Lombok @Data注解无法生成getter/setter方法的编译问题。项目使用Spring Boot 3.2.1，最初配置了Maven编译器插件3.11.0，Java 17源码/目标版本，以及Lombok 1.18.30作为注解处理器。

### 解决方案
1. 首先尝试升级Lombok版本到1.18.32，同步更新编译器插件中的Lombok版本
2. 升级Maven编译器插件版本到3.12.1
3. 检查发现Maven使用的Java版本(24.0.2)与系统默认版本(17.0.16)不一致
4. 通过临时设置JAVA_HOME环境变量为Java 17路径(/opt/homebrew/opt/openjdk@17)，使用命令`env JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn clean compile`成功解决编译问题

### 经验教训
1. Java版本兼容性问题是常见的构建障碍，特别是当系统默认Java版本与项目所需版本不一致时
2. Lombok与最新Java版本可能存在兼容性问题，需要选择匹配的Lombok版本
3. Maven默认使用的Java版本可能与系统默认版本不同，需要明确指定
4. 构建问题排查时应首先检查基础环境配置，如Java版本、依赖版本等

### 最佳实践
1. 在项目文档中明确记录所需的Java版本和依赖版本
2. 在构建脚本中添加环境变量设置，确保使用正确的Java版本
3. 定期检查并更新依赖版本，保持与最新Java版本的兼容性
4. 遇到编译问题时，优先检查Java版本和依赖版本的兼容性

## 相关资源
- **文档链接**: 
  - 知识管理计划: docs/plans/12-知识管理计划.md
  - Maven编译器插件文档: https://maven.apache.org/plugins/maven-compiler-plugin/
  - Lombok官方文档: https://projectlombok.org/
- **代码示例**: 
  - auth-service项目pom.xml配置
- **参考资料**: 
  - Java版本兼容性矩阵
  - Lombok版本发布说明