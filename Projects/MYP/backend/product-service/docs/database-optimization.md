# 产品服务数据库设计与优化方案

## 1. 现状分析

通过对产品服务实体类的分析，当前数据模型存在以下特点和可优化点：

### 1.1 实体类结构
- **Product**：包含id、name、description、price、stockQuantity等字段
- **Order**：包含id、orderNo、productId、quantity、totalAmount等字段

### 1.2 当前数据库配置
- 使用MySQL数据库
- 连接URL：`jdbc:mysql://localhost:3306/product_service?useSSL=false&serverTimezone=UTC`
- JPA配置：`hibernate.ddl-auto=update`，`show-sql=true`

### 1.3 可优化点
- 缺少适当的索引导致查询性能不佳
- 未配置连接池参数
- 未优化JPA/Hibernate配置

## 2. 优化方案

### 2.1 索引优化

#### 2.1.1 Product表索引
```sql
-- 为name字段添加普通索引
CREATE INDEX idx_product_name ON products(name);

-- 为category_id字段添加普通索引
CREATE INDEX idx_product_category ON products(category_id);

-- 为tenant_id字段添加普通索引
CREATE INDEX idx_product_tenant ON products(tenant_id);

-- 为status和tenant_id添加复合索引（常用于多租户查询）
CREATE INDEX idx_product_status_tenant ON products(status, tenant_id);
```

#### 2.1.2 Order表索引
```sql
-- 为order_no字段添加唯一索引（已在实体类中定义为unique）
-- 为product_id字段添加普通索引
CREATE INDEX idx_order_product ON orders(product_id);

-- 为tenant_id字段添加普通索引
CREATE INDEX idx_order_tenant ON orders(tenant_id);

-- 为status字段添加普通索引
CREATE INDEX idx_order_status ON orders(status);

-- 为product_id和status添加复合索引（常用于关联查询）
CREATE INDEX idx_order_product_status ON orders(product_id, status);
```

### 2.2 连接池优化

修改`application.yml`文件，添加以下连接池配置：
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      validation-timeout: 5000
      test-while-idle: true
      test-on-borrow: false
      test-on-return: false
      connection-test-query: SELECT 1
```

### 2.3 数据库配置优化

#### 2.3.1 MySQL配置优化
建议在MySQL配置文件中添加以下配置：
```ini
[mysqld]
innodb_buffer_pool_size = 512M
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
query_cache_size = 64M
query_cache_type = 1
```

#### 2.3.2 JPA/Hibernate配置优化
修改`application.yml`文件，更新以下JPA配置：
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: false
        cache:
          use_second_level_cache: true
          region.factory_class: org.hibernate.cache.ehcache.EhCacheRegionFactory
        jdbc:
          batch_size: 20
          fetch_size: 50
```

## 3. 实施计划

1. **准备阶段**（1天）
   - 创建数据库优化方案文档
   - 备份当前数据库

2. **实施阶段**（2天）
   - 添加索引
   - 配置连接池
   - 优化JPA/Hibernate配置
   - 优化MySQL配置

3. **测试阶段**（1天）
   - 性能测试
   - 功能验证
   - 监控数据库性能

4. **总结阶段**（1天）
   - 编写优化报告
   - 记录经验教训

## 4. 风险评估

1. **数据丢失风险**：实施前务必进行数据库备份
2. **性能回退风险**：部分索引可能导致写入性能下降
3. **配置冲突风险**：连接池配置可能与其他服务冲突

## 5. 预期效果

1. 查询性能提升50%-80%
2. 连接池利用率提高，资源消耗降低
3. 数据库稳定性增强
4. 系统整体响应时间缩短