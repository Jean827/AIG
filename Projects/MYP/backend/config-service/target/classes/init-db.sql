-- 创建数据库
CREATE DATABASE IF NOT EXISTS config_service;

-- 使用数据库
USE config_service;

-- 创建配置项表
CREATE TABLE IF NOT EXISTS config_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    value TEXT NOT NULL,
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    environment VARCHAR(20) NOT NULL,
    application VARCHAR(50) NOT NULL,
    version VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
    created_by VARCHAR(50),
    updated_at DATETIME NOT NULL,
    updated_by VARCHAR(50),
    attributes JSON,
    change_reason VARCHAR(255),
    risk_level VARCHAR(10),
    rollback_plan TEXT
);

-- 创建索引
CREATE INDEX idx_config_items_application_environment ON config_items(application, environment);
CREATE INDEX idx_config_items_status ON config_items(status);
CREATE INDEX idx_config_items_type ON config_items(type);
CREATE INDEX idx_config_items_name ON config_items(name);