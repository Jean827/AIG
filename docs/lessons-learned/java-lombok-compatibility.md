# 技术经验总结

## 基本信息
- **总结时间**: 2025-08-12 15:30:00 CST
- **总结人员**: 技术团队
- **技术领域**: Java开发、构建工具
- **项目阶段**: 认证授权服务开发阶段(70%)
- **文档版本**: v1.0
- **关联计划**: 知识管理计划(v1.0)

## 经验描述
### 背景
在认证授权服务(auth-service)开发过程中，遇到多个编译和运行问题，包括Lombok @Data注解无法生成getter/setter方法、Spring Boot 3.x迁移中的JPA包名变更、数据库连接配置错误、类重复定义以及因Lombok依赖问题导致的`java.lang.ExceptionInInitializerError: com.sun.tools.javac.code.TypeTag :: UNKNOWN`编译错误等问题。项目使用Spring Boot 3.2.1，Java 17源码/目标版本，Lombok 1.18.32以及相关依赖。

### 解决方案
#### 技术解决方案
1. **Lombok兼容性问题**
   - 实施步骤：
     1. 更新pom.xml文件中的Lombok依赖版本至1.18.32
     2. 同步更新Maven编译器插件中的Lombok版本
     3. 升级Maven编译器插件版本至3.12.1
     4. 设置JAVA_HOME环境变量为Java 17路径(/opt/homebrew/opt/openjdk@17)
   - 替代方案：如问题持续，可考虑完全移除Lombok依赖

2. **Spring Boot 3.x JPA迁移**
   - 实施步骤：
     1. 将JPA注解包名从javax.persistence更新为jakarta.persistence
     2. 添加jakarta.persistence-api依赖(3.1.0版本)
     3. 使用IDE的全局替换功能更新所有相关实体类的导入语句

3. **数据库配置错误**
   - 实施步骤：
     1. 更新application.yml文件中的数据库用户名和密码
     2. 使用MySQL命令行创建auth_service数据库
     3. 验证数据库URL格式和驱动类配置

4. **类重复定义问题**
   - 实施步骤：
     1. 执行`mvn clean`命令清理target目录
     2. 删除所有残留编译文件
     3. 检查包结构和类路径，确保每个类只有一个定义

5. **完全移除Lombok依赖**
   - 实施步骤：
     1. 从pom.xml中移除Lombok依赖和annotationProcessorPaths配置
     2. 为使用@RequiredArgsConstructor注解的类添加手动构造函数
     3. 为使用@Data注解的类添加手动getter/setter方法
     4. 移除所有Lombok相关import语句

### 经验教训
#### 技术经验教训
1. **Java版本兼容性**：系统默认Java版本与项目所需版本不一致是常见构建障碍，需明确指定项目使用的Java版本，并确保JAVA_HOME环境变量正确设置。
2. **Lombok兼容性**：Lombok与最新Java版本可能存在兼容性问题，需选择匹配的Lombok版本。在遇到难以解决的兼容性问题时，考虑完全移除Lombok依赖。
3. **Spring Boot 3.x迁移**：Spring Boot 3.x中将JPA包名从javax.persistence变更为jakarta.persistence，需更新所有相关实体类的导入语句。
4. **依赖管理**：Spring Boot 3.x可能需要显式添加某些以前由starter提供的依赖，如jakarta.persistence-api。

#### 管理经验教训
1. **Maven配置管理**：Maven默认使用的Java版本可能与系统默认版本不同，需在构建脚本中明确配置source、target和release版本。
2. **配置文件管理**：数据库用户名、密码和URL配置错误是常见连接问题来源，需建立配置文件审核机制。
3. **构建环境管理**：编译残留文件可能导致类重复定义错误，定期执行`mvn clean`命令清理项目是良好实践。
4. **依赖移除流程**：移除Lombok等依赖时，需制定详细的移除流程，确保彻底清理所有相关代码。

### 最佳实践
#### 技术最佳实践
1. **版本管理**：在项目文档中明确记录所需的Java版本、Spring Boot版本、Lombok版本和其他关键依赖版本，并保持版本一致性。
2. **依赖管理**：熟悉Spring Boot 3.x的依赖变化，确保添加所有必要的显式依赖，如jakarta.persistence-api；谨慎使用Lombok等编译时注解处理器，确保依赖配置完整。
3. **Spring Boot 3.x迁移**：迁移到Spring Boot 3.x时，全面检查并更新JPA注解包名；使用IDE的全局替换功能提高效率。
4. **Lombok使用与移除**：如决定使用Lombok，确保所有相关依赖和配置正确；如决定移除Lombok，使用IDE的重构功能自动添加构造函数和getter/setter方法，然后彻底清理所有Lombok相关代码。

#### 管理最佳实践
1. **环境配置管理**：在构建脚本中添加环境变量设置，确保使用正确的Java版本；考虑使用工具如jenv或SDKMAN!管理多个Java版本；明确设置JAVA_HOME环境变量。
2. **依赖更新管理**：定期检查并更新依赖版本，保持与最新Java版本的兼容性；使用Maven Dependency Plugin分析依赖冲突。
3. **问题排查流程**：遇到编译问题时，优先检查Java版本、依赖版本的兼容性以及环境配置；查看详细的编译错误日志以定位问题根源。
4. **配置文件安全管理**：将数据库凭据存储在安全的地方，避免硬编码在配置文件中；使用环境变量或配置服务器管理敏感信息。
5. **构建环境维护**：定期执行`mvn clean`命令清理项目，特别是在遇到类定义冲突或编译残留问题时。

## 相关资源
- **文档链接**: 
  - 知识管理计划: <mcfile name="12-知识管理计划.md" path="/Users/Data/AIG/docs/plans/12-知识管理计划.md"></mcfile>
  - Maven编译器插件文档: <mcurl name="Maven Compiler Plugin Documentation" url="https://maven.apache.org/plugins/maven-compiler-plugin/"></mcurl>
  - Lombok官方文档: <mcurl name="Lombok Official Documentation" url="https://projectlombok.org/"></mcurl>
  - Spring Boot 3.x迁移指南: <mcurl name="Spring Boot 3.x Migration Guide" url="https://docs.spring.io/spring-boot/docs/current/reference/html/migration.html"></mcurl>

- **代码示例**: 
  - auth-service项目pom.xml配置: <mcfile name="pom.xml" path="/Users/Data/AIG/Projects/MYP/backend/auth-service/pom.xml"></mcfile>
  - auth-service项目application.yml配置: <mcfile name="application.yml" path="/Users/Data/AIG/Projects/MYP/backend/auth-service/src/main/resources/application.yml"></mcfile>

- **参考资料**: 
  - Java版本兼容性矩阵: <mcurl name="Java Version Compatibility Matrix" url="https://www.oracle.com/java/technologies/java-se-support-roadmap.html"></mcurl>
  - Lombok版本发布说明: <mcurl name="Lombok Release Notes" url="https://projectlombok.org/changelog"></mcurl>