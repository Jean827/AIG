package com.example.configservice.model;

import java.time.LocalDateTime;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "config_items")
public class ConfigItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 配置项标识，遵循CFG-{类型}-{编号}-{版本}格式
    private String configId;

    // 配置项名称
    private String name;

    // 配置项类型
    private String type;

    // 配置项值
    private String value;

    // 配置项描述
    private String description;

    // 配置项状态：草稿、待审核、已批准、已发布、已废弃
    private String status;

    // 所属环境：dev、test、prod等
    private String environment;

    // 所属应用
    private String application;

    // 版本号
    private String version;

    // 创建时间
    private LocalDateTime createdAt;

    // 创建人
    private String createdBy;

    // 最后修改时间
    private LocalDateTime updatedAt;

    // 最后修改人
    private String updatedBy;

    // 扩展属性
    private Map<String, Object> attributes;

    // 变更原因
    private String changeReason;

    // 风险等级
    private String riskLevel;

    // 回滚方案
    private String rollbackPlan;
}