-- 数据库初始化脚本
-- 版本: v1.0
-- 遵循开发管理计划 (04-开发管理计划.md) 中的脚本使用规范

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    status INT NOT NULL DEFAULT 1,
    tenant_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建角色表
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 创建用户角色关联表
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    status INT NOT NULL DEFAULT 1,
    category_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建产品分类表
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    tenant_id BIGINT NOT NULL
);

-- 创建租户表
CREATE TABLE IF NOT EXISTS tenants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    status INT NOT NULL DEFAULT 1
);

-- 插入测试数据
-- 插入租户数据
INSERT INTO tenants (name, description) VALUES ('测试租户', '用于开发测试的租户');

-- 插入角色数据
INSERT INTO roles (name, description) VALUES ('ROLE_USER', '普通用户角色');
INSERT INTO roles (name, description) VALUES ('ROLE_ADMIN', '管理员角色');

-- 插入测试用户 (密码: password)
INSERT INTO users (username, password, email, status, tenant_id) VALUES (
    'testuser',
    '$2a$10$eXKtWX51.0w0Q5lS5gXq9e.3cK9w0Y8X5X5X5X5X5X5X5X5X5X5',
    'test@example.com',
    1,
    1
);

-- 关联用户和角色
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

-- 插入产品分类
INSERT INTO categories (name, description, tenant_id) VALUES ('电子产品', '各类电子设备', 1);

-- 插入测试产品
INSERT INTO products (name, description, price, stock_quantity, status, category_id, tenant_id) VALUES (
    '测试手机',
    '这是一款测试手机',
    1999.99,
    100,
    1,
    1,
    1
);