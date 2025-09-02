package com.example.configservice.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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
    @ElementCollection
    @MapKeyColumn(name = "attribute_key")
    @Column(name = "attribute_value")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> attributes = new HashMap<>();

    // 变更原因
    private String changeReason;

    // 风险等级
    private String riskLevel;

    // 回滚方案
    private String rollbackPlan;
}