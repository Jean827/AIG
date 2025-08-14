package com.example.tenant.model;

import javax.persistence.*;
import java.util.Date;

/**
 * 租户实体类
 */
@Entity
@Table(name = "tenants")
public class Tenant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_name", nullable = false, unique = true)
    private String tenantName;

    @Column(name = "tenant_code", nullable = false, unique = true)
    private String tenantCode;

    @Column(name = "custom_schema_name")
    private String customSchemaName;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private Integer status; // 0: 禁用, 1: 启用

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    // getter and setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantName() {
        return tenantName;
    }

    public void setTenantName(String tenantName) {
        this.tenantName = tenantName;
    }

    public String getTenantCode() {
        return tenantCode;
    }

    public void setTenantCode(String tenantCode) {
        this.tenantCode = tenantCode;
    }

    public String getCustomSchemaName() {
        return customSchemaName;
    }

    public void setCustomSchemaName(String customSchemaName) {
        this.customSchemaName = customSchemaName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}