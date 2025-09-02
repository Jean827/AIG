# 技术经验总结

## 基本信息
- **总结时间**: 2025-08-15 10:30:00 CST
- **总结人员**: 技术团队
- **技术领域**: 微服务开发、Spring Boot、JPA、Lombok
- **项目阶段**: MYP项目迭代4(80%)

## 概述
本总结文档整合了MYP项目开发过程中的关键经验教训，涵盖认证授权服务测试、Lombok兼容性、Spring Boot 3.x JPA迁移以及循环依赖解决等方面的最佳实践和解决方案。

## 认证授权服务API测试
### 核心经验
- **测试环境**：服务器地址为http://localhost:8081，API前缀为/api/auth
- **关键测试用例**：
  - 用户登录：验证获取访问令牌和刷新令牌的功能
  - 刷新访问令牌：验证使用刷新令牌获取新访问令牌的流程
  - 令牌黑名单：验证注销后令牌失效的机制
- **依赖服务**：确保Redis服务正常运行，因为刷新令牌和黑名单功能依赖Redis
- **测试工具**：推荐使用Postman或curl进行测试

### 最佳实践
- 测试完成后清理测试数据
- 使用环境变量或配置服务器管理敏感测试数据
- 实现自动化测试用例，确保API功能持续可用

## Lombok兼容性与Java版本管理
### 核心问题
- Lombok @Data注解无法生成getter/setter方法
- Java版本与项目所需版本不一致导致构建失败
- Maven编译器插件版本与Java版本不匹配

### 解决方案
- 升级Lombok版本至1.18.32，同步更新编译器插件
- 升级Maven编译器插件至3.12.1
- 设置JAVA_HOME环境变量为Java 17路径(/opt/homebrew/opt/openjdk@17)
- 定期执行`mvn clean`命令清理项目，避免类重复定义错误

### 最佳实践
- 在项目文档中明确记录所需的Java、Spring Boot、Lombok版本
- 使用jenv或SDKMAN!管理多个Java版本
- 定期检查并更新依赖版本，保持兼容性

## Spring Boot 3.x JPA迁移
### 核心变更
- JPA注解包名从`javax.persistence`变更为`jakarta.persistence`
- 需显式添加jakarta.persistence-api依赖(3.1.0版本)
- 数据库连接配置需仔细检查用户名、密码和URL

### 迁移步骤
1. 添加jakarta.persistence-api依赖
2. 更新所有实体类的导入语句
3. 验证数据库连接配置，确保凭据正确
4. 使用MySQL命令行创建所需数据库

### 代码示例
```xml
<dependency>
    <groupId>jakarta.persistence</groupId>
    <artifactId>jakarta.persistence-api</artifactId>
    <version>3.1.0</version>
</dependency>
```

```java
// 替换前
import javax.persistence.*;

// 替换后
import jakarta.persistence.*;
```

## 循环依赖问题解决
### 问题表现
- 认证服务启动时出现循环依赖：jwtAuthenticationFilter → jwtTokenProvider → userServiceImpl → securityConfig → jwtAuthenticationFilter
- 端口冲突导致服务无法启动

### 解决方案
- **识别依赖路径**：通过错误日志分析完整依赖循环
- **使用@Lazy注解**：在构造函数参数上添加@Lazy注解，而非仅在字段上
- **显式构造函数注入**：移除@RequiredArgsConstructor，使用显式构造函数
- **解决端口冲突**：为每个服务配置唯一端口，最终认证服务使用8090端口

### 最佳实践
- **设计层面避免循环依赖**：遵循单一职责原则，减少组件耦合
- **依赖注入策略**：优先使用构造函数注入，谨慎使用字段注入
- **配置管理**：使用配置中心集中管理端口等环境特定配置
- **启动验证**：实现健康检查端点，添加集成测试提前发现依赖问题

## 总结
通过这些经验教训，项目团队建立了处理常见问题的标准流程，包括依赖管理、版本迁移、测试策略和配置管理。这些实践将有助于提高代码质量、减少开发障碍并加速项目交付。