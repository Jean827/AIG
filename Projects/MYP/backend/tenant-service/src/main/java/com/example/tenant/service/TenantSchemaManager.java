package com.example.tenant.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * 租户Schema管理服务
 * 负责创建和管理租户的数据库Schema及表结构
 */
@Component
public class TenantSchemaManager {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public TenantSchemaManager(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * 创建租户Schema并初始化表结构
     * @param tenantCode 租户编码
     */
    public void createTenantSchema(String tenantCode) {
        // 确保租户编码只包含字母、数字和下划线
        String safeTenantCode = sanitizeTenantCode(tenantCode);
        // 创建Schema的SQL语句
        String createSchemaSql = "CREATE SCHEMA IF NOT EXISTS `" + safeTenantCode + "`";
        jdbcTemplate.execute(createSchemaSql);

        // 初始化租户表结构
        initializeTenantTables(safeTenantCode);
    }

    /**
     * 删除租户Schema
     * @param tenantCode 租户编码
     */
    public void dropTenantSchema(String tenantCode) {
        String safeTenantCode = sanitizeTenantCode(tenantCode);
        String dropSchemaSql = "DROP SCHEMA IF EXISTS `" + safeTenantCode + "`";
        jdbcTemplate.execute(dropSchemaSql);
    }

    /**
     * 初始化租户表结构
     * @param tenantCode 租户编码
     */
    private void initializeTenantTables(String tenantCode) {
        try (Connection connection = jdbcTemplate.getDataSource().getConnection()) {
            // 设置当前Schema
            connection.setSchema(tenantCode);

            // 执行SQL脚本初始化表结构
            // 从classpath加载SQL脚本
            String sqlScript = StreamUtils.copyToString(
                    new ClassPathResource("db/schema.sql").getInputStream(),
                    StandardCharsets.UTF_8);

            // 执行SQL脚本
            ScriptUtils.executeSqlScript(connection, new org.springframework.core.io.ByteArrayResource(sqlScript.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("初始化租户表结构失败: " + tenantCode, e);
        }
    }

    /**
     * 验证并清理租户编码，确保它只包含安全的字符
     * @param tenantCode 租户编码
     * @return 清理后的租户编码
     */
    private String sanitizeTenantCode(String tenantCode) {
        // 只允许字母、数字和下划线
        return tenantCode.replaceAll("[^a-zA-Z0-9_]", "");
    }
}