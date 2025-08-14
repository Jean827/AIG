# 计量计费服务 (Metering Service)

## 概述
计量计费服务是MYP系统的一个核心组件，负责记录和统计租户对系统资源的使用情况，并生成相应的账单。

## 功能特性
- 记录租户的资源使用情况
- 按租户、资源类型等维度统计使用量
- 生成租户账单
- 标记账单为已结算
- 提供REST API接口供其他服务调用

## 技术栈
- Spring Boot 3.x
- Spring Data JPA
- MySQL 8.x
- Java 17+

## 项目结构
```
com.example.metering_service
├── controller      # REST API控制器
├── model           # 实体类
├── repository      # 数据访问层
├── service         # 服务层接口
└── service.impl    # 服务层实现
```

## 核心实体
- **MeteringRecord**: 记录租户的资源使用情况，包括租户ID、资源类型、使用量、使用时间等信息

## API接口
### 记录资源使用量
- **URL**: /api/metering
- **方法**: POST
- **请求体**: MeteringRecord对象
- **响应**: 保存后的MeteringRecord对象

### 获取租户资源使用统计
- **URL**: /api/metering/statistics/tenant/{tenantId}?start={start}&end={end}
- **方法**: GET
- **参数**: tenantId(租户ID), start(开始时间), end(结束时间)
- **响应**: 按资源类型分组的使用统计(Map<String, Double>)

### 生成租户账单
- **URL**: /api/metering/bill/tenant/{tenantId}?start={start}&end={end}
- **方法**: GET
- **参数**: tenantId(租户ID), start(开始时间), end(结束时间)
- **响应**: 账单金额(Double)

### 获取未结算的计量记录
- **URL**: /api/metering/unbilled
- **方法**: GET
- **响应**: 未结算的计量记录列表(List<MeteringRecord>)

### 标记计量记录为已结算
- **URL**: /api/metering/mark-billed
- **方法**: POST
- **请求体**: 计量记录ID列表(List<Long>)
- **响应**: 无内容

## 配置说明
服务的配置信息位于application.properties文件中，包括服务器端口、数据库连接信息、JPA配置等。

## 运行说明
1. 确保MySQL数据库已启动
2. 修改application.properties文件中的数据库连接信息
3. 运行MeteringServiceApplication类
4. 服务将在http://localhost:8086端口启动

## 后续改进计划
1. 添加更复杂的计费策略
2. 实现定时任务自动生成账单
3. 集成消息队列，处理大量的计量数据
4. 添加缓存机制，提高查询性能
5. 实现数据备份和恢复功能