# 技术经验总结

## 基本信息
- **总结时间**: 2025-08-12 15:30:00 CST
- **总结人员**: 技术团队
- **技术领域**: Java开发、构建工具
- **项目阶段**: 认证授权服务开发阶段(70%)

## 经验描述
### 背景
在认证授权服务(auth-service)开发过程中，遇到多个编译和运行问题，包括Lombok @Data注解无法生成getter/setter方法、Spring Boot 3.x迁移中的JPA包名变更、数据库连接配置错误以及类重复定义等问题。项目使用Spring Boot 3.2.1，Java 17源码/目标版本，Lombok 1.18.32以及相关依赖。

### 解决方案
1. **Lombok兼容性问题**：升级Lombok版本到1.18.32，同步更新编译器插件中的Lombok版本；升级Maven编译器插件版本到3.12.1；设置JAVA_HOME环境变量为Java 17路径(/opt/homebrew/opt/openjdk@17)。
2. **Spring Boot 3.x JPA迁移**：将JPA注解包名从javax.persistence更新为jakarta.persistence；添加jakarta.persistence-api依赖(3.1.0版本)；更新相关实体类的导入语句。
3. **数据库配置错误**：更新application.yml文件中的数据库用户名和密码；使用MySQL命令行创建auth_service数据库；确保数据库URL、驱动类配置正确。
4. **类重复定义问题**：执行`mvn clean`命令清理target目录，删除残留编译文件；检查包结构和类路径，确保每个类只有一个定义。

### 经验教训
1. **Java版本兼容性**：系统默认Java版本与项目所需版本不一致是常见构建障碍，需明确指定项目使用的Java版本。
2. **Lombok兼容性**：Lombok与最新Java版本可能存在兼容性问题，需选择匹配的Lombok版本。
3. **Maven配置**：Maven默认使用的Java版本可能与系统默认版本不同，需在构建脚本中明确配置。
4. **Spring Boot 3.x迁移**：Spring Boot 3.x中将JPA包名从javax.persistence变更为jakarta.persistence，需更新所有相关实体类的导入语句。
5. **数据库配置**：数据库用户名、密码和URL配置错误是常见连接问题来源，需仔细检查配置文件。
6. **类重复定义**：编译残留文件可能导致类重复定义错误，定期执行`mvn clean`命令清理项目是良好实践。
7. **依赖管理**：Spring Boot 3.x可能需要显式添加某些以前由starter提供的依赖，如jakarta.persistence-api。

### 最佳实践
1. **版本管理**：在项目文档中明确记录所需的Java版本、Spring Boot版本、Lombok版本和其他关键依赖版本。
2. **环境配置**：在构建脚本中添加环境变量设置，确保使用正确的Java版本；考虑使用工具如jenv或SDKMAN!管理多个Java版本。
3. **依赖更新**：定期检查并更新依赖版本，保持与最新Java版本的兼容性；使用Maven Dependency Plugin分析依赖冲突。
4. **问题排查**：遇到编译问题时，优先检查Java版本、依赖版本的兼容性以及环境配置。
5. **Spring Boot 3.x迁移**：迁移到Spring Boot 3.x时，全面检查并更新JPA注解包名；使用IDE的全局替换功能提高效率。
6. **数据库配置**：将数据库凭据存储在安全的地方，避免硬编码在配置文件中；使用环境变量或配置服务器管理敏感信息。
7. **构建清理**：定期执行`mvn clean`命令清理项目，特别是在遇到类定义冲突或编译残留问题时。
8. **依赖管理**：熟悉Spring Boot 3.x的依赖变化，确保添加所有必要的显式依赖，如jakarta.persistence-api。

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